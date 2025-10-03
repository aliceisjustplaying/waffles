import { AppBskyLabelerService, AtpAgent } from '@atproto/api';

import logger from './logger.js';

const IDENTIFIER = process.env.BSKY_IDENTIFIER;
const PASSWORD = process.env.BSKY_PASSWORD;
const SERVICE = process.env.PDS_URL ?? 'https://bsky.social';

async function updateReasonTypes() {
  if (!IDENTIFIER || !PASSWORD) {
    throw new Error('Missing BSKY_IDENTIFIER or BSKY_PASSWORD environment variables.');
  }

  const agent = new AtpAgent({ service: SERVICE });
  await agent.login({ identifier: IDENTIFIER, password: PASSWORD });

  const repo = agent.session?.did;

  if (!repo) {
    throw new Error('Could not resolve DID for the labeler account.');
  }

  const recordResponse = await agent.com.atproto.repo
    .getRecord({ collection: 'app.bsky.labeler.service', rkey: 'self', repo })
    .catch(() => null);

  if (!recordResponse?.data?.value) {
    logger.info('No labeler service record found; nothing to update.');
    return;
  }

  const currentRecord = recordResponse.data.value as AppBskyLabelerService.Record;

  if (Array.isArray(currentRecord.reasonTypes) && currentRecord.reasonTypes.length === 0) {
    logger.info('reasonTypes is already an empty array; no changes applied.');
    return;
  }

  const updatedRecord: AppBskyLabelerService.Record = {
    ...currentRecord,
    reasonTypes: [],
  };

  await agent.com.atproto.repo.putRecord({
    collection: 'app.bsky.labeler.service',
    rkey: 'self',
    repo,
    record: updatedRecord,
    swapRecord: recordResponse.data.cid,
  });

  logger.info('Successfully updated reasonTypes to an empty array.');
}

updateReasonTypes().catch((error) => {
  logger.error(`Failed to clear reasonTypes: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
