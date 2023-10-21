/*
  Warnings:

  - You are about to drop the `musics_from_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "musics_from_user";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_MusicToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MusicToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "musics" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_MusicToUser_AB_unique" ON "_MusicToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicToUser_B_index" ON "_MusicToUser"("B");
