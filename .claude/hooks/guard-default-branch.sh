#!/usr/bin/env bash
#
# PreToolUse(Bash) guard: never commit or push while HEAD is the default branch.
#
# Work on this repo goes on a branch and lands through a pull request. That is
# a standing instruction in the agent prompt, but a skill or a ticket can carry
# a more specific instruction that contradicts it ("commit your work to the
# current branch"), and the more specific instruction tends to win. This hook is
# the layer that does not depend on anyone remembering: the harness runs it
# before the tool call, and a denial here means the command never executes.
#
# Reads the pending tool call as JSON on stdin. Prints nothing to allow, or a
# permissionDecision of "deny" to block, in which case the reason is handed back
# to the agent so it can branch and carry on.
#
# This constrains the agent, not the human. A `!` command from the prompt is not
# a tool call and never reaches this hook.

set -uo pipefail

command=$(jq -r '.tool_input.command // ""' 2>/dev/null) || exit 0

# Fast path: nearly every Bash call is neither a commit nor a push. Match on a
# substring rather than a prefix, because the call that motivated this hook was
# `git add -A && git commit ...`, which no prefix rule would have caught.
case "$command" in
	*"git commit"* | *"git push"*) ;;
	*) exit 0 ;;
esac

# Not a git repo, or no branch: nothing to protect.
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || exit 0
[ -n "$branch" ] || exit 0

# Ask the remote which branch is default, so this works in a repo that uses
# master, trunk, or anything else. Fall back to main when there is no remote.
default=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null)
default=${default#origin/}
[ -n "$default" ] || default=main

[ "$branch" = "$default" ] || exit 0

jq -n --arg branch "$branch" '{
	hookSpecificOutput: {
		hookEventName: "PreToolUse",
		permissionDecision: "deny",
		permissionDecisionReason: (
			"Blocked: HEAD is \($branch), the default branch. Work on this repo lands through a pull request. Create a branch (git checkout -b <name>), commit there, push, and open a PR with `gh pr create`. If a skill or ticket told you to commit to the current branch, this rule wins."
		)
	}
}'
