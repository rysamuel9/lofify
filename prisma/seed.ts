import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { artistsData } from './songsData';

// handle database connection
const prisma = new PrismaClient();

const run = async () => {
  // insert the artist and the songs into the database, followed by a user and the followed by some some playlists
  // that belong to the user
  await Promise.all(
    artistsData.map(async (artist) => {
      // upsert mean create or update
      return prisma.artist.upsert({
        where: { name: artist.name },
        update: {},
        create: {
          name: artist.name,
          songs: {
            create: artist.songs.map((song) => ({
              name: song.name,
              duration: song.duration,
              url: song.url,
            })),
          },
        },
      });
    })
  );
};

run()
  .then()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
