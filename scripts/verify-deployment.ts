import { verifyDeployments } from '../src/deployment/verify.ts';

const [productionUrl, betaUrl] = process.argv.slice(2);

if (!productionUrl || !betaUrl) {
	console.error('usage: npm run verify:deployment -- <production-url> <beta-url>');
	process.exitCode = 2;
} else {
	try {
		const failures = await verifyDeployments(productionUrl, betaUrl);
		if (failures.length === 0) {
			console.log('deployment verification passed');
		} else {
			for (const failure of failures) console.error(`- ${failure}`);
			process.exitCode = 1;
		}
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
