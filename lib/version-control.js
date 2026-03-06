import { execSync as exec } from 'node:child_process';

export default function versionControl(files, metalsmith) {
    const commitHash = exec('git rev-parse HEAD', { encoding: 'utf-8' }).trim();

    const metadata = metalsmith.metadata();

    metadata.commitHash = commitHash;
    metadata.commitHash_Short = commitHash.substring(0, 8);
}
