import { Bot } from '@skyware/bot';

import { BSKY_IDENTIFIER, BSKY_PASSWORD } from './config.js';

const bot = new Bot();

try {
  await bot.login({
    identifier: BSKY_IDENTIFIER,
    password: BSKY_PASSWORD,
  });
} catch (error) {
  console.error('Error logging in: ', error);
  process.exit(1);
}

process.stdout.write('WARNING: This will delete all posts in your profile. Are you sure you want to continue? (y/n) ');

const answer = await new Promise((resolve) => {
  process.stdin.once('data', (data) => {
    resolve(data.toString().trim().toLowerCase());
  });
});

if (answer === 'y') {
  const postsToDelete = await bot.profile.getPosts();
  for (const post of postsToDelete.posts) {
    await post.delete();
  }
  console.log('All posts have been deleted.');
} else {
  console.log('Operation cancelled.');
  process.exit(0);
}

const deletePost = await bot.post({ text: 'Like this post to delete all labels.' });
const deletePostRkey = deletePost.uri.split('/').pop()!;
console.log('Delete post rkey:');
console.log(`export const DELETE = '${deletePostRkey}';`);

process.exit(0);
