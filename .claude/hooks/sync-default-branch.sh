#!/usr/bin/env bash
#
# SessionStart hook: fetch origin and fast-forward the local default branch.
#
# After a PR merges, local main is stale. The next branch cut from it silently
# omits the merged work, and the fix — `git switch main && git pull` — is a
# manual step nobody remembers until there is a conflict. This runs it at the
# one moment that is always before the branching: the start of the session.
#
# It only ever fast-forwards. It will not merge, rebase, force, stash, or touch
# a branch other than the default one, and it leaves everything alone when the
# working tree is dirty or the branch has diverged. Failure is never fatal: no
# network, no remote, or no repo all exit quietly, because a session must start
# whether or not GitHub is reachable.
#
# Companion to guard-default-branch.sh, which stops work landing on main in the
# first place. This one keeps main worth branching from.

set -uo pipefail

note() {
	jq -n --arg msg "$1" '{systemMessage: $msg}'
}

git rev-parse --git-dir >/dev/null 2>&1 || exit 0
git remote get-url origin >/dev/null 2>&1 || exit 0

default=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null)
default=${default#origin/}
[ -n "$default" ] || default=main

git fetch --quiet origin 2>/dev/null || exit 0
git rev-parse --verify --quiet "refs/remotes/origin/$default" >/dev/null 2>&1 || exit 0

# No local copy of the default branch: nothing to fast-forward.
local_sha=$(git rev-parse --verify --quiet "refs/heads/$default") || exit 0
remote_sha=$(git rev-parse "refs/remotes/origin/$default")
[ "$local_sha" != "$remote_sha" ] || exit 0

# Refuse anything that is not a fast-forward. Local commits on the default
# branch are exactly the situation this repo's other hook exists to prevent, so
# if they are here, say so rather than quietly moving the ref.
if ! git merge-base --is-ancestor "$local_sha" "$remote_sha" 2>/dev/null; then
	note "Local $default has commits that origin/$default does not. Left it alone — move them to a branch."
	exit 0
fi

behind=$(git rev-list --count "$local_sha..$remote_sha" 2>/dev/null || echo "")
commits="$behind commit(s)"
[ "$behind" = "1" ] && commits="1 commit"

current=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

if [ "$current" != "$default" ]; then
	# Not checked out: update the ref directly. Without a leading `+` this
	# refspec refuses anything but a fast-forward, so the safety is git's.
	if git fetch --quiet origin "$default:$default" 2>/dev/null; then
		note "Fast-forwarded $default to origin/$default ($commits). You are on $current."
	fi
elif git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
	if git merge --ff-only --quiet "origin/$default" 2>/dev/null; then
		note "Fast-forwarded $default to origin/$default ($commits)."
	fi
else
	note "$default is $commits behind origin/$default, but the working tree is dirty. Left it alone."
fi

exit 0
