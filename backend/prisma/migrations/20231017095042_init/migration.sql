-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Verifying', 'Enable', 'Disable');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('Google');

-- CreateEnum
CREATE TYPE "RefereeClass" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "RosterStatus" AS ENUM ('Enable', 'Graduate', 'Disable');

-- CreateEnum
CREATE TYPE "RosterType" AS ENUM ('Athlete', 'Staff', 'Coach', 'HeadCoach');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('HomeWin', 'AwayWin', 'Draw', 'NotFinished');

-- CreateEnum
CREATE TYPE "RefereePosition" AS ENUM ('Referee', 'SideJudge', 'LineJudge', 'BackJudge', 'FieldJudge', 'Umpire', 'DownJudge');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Manager', 'User');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "username" VARCHAR(128) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'Verifying',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "role" "Role" NOT NULL,
    "profile_img_url" TEXT,
    "last_password_changed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuth" (
    "account_id" INTEGER NOT NULL,
    "provider_id" VARCHAR(256) NOT NULL,
    "provider_type" "OAuthProvider" NOT NULL,

    CONSTRAINT "OAuth_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Referee" (
    "account_id" INTEGER NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "class" "RefereeClass" NOT NULL DEFAULT 'C',

    CONSTRAINT "Referee_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Press" (
    "account_id" INTEGER NOT NULL,
    "association" VARCHAR(128) NOT NULL,
    "cell_phone_number" VARCHAR(64) NOT NULL,

    CONSTRAINT "Press_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationAllow" (
    "account_id" INTEGER NOT NULL,
    "agree" BOOLEAN NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationAllow_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "content" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "post_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,

    CONSTRAINT "PostType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" VARCHAR(256) NOT NULL,
    "file_type" VARCHAR(64) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Association" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "global_name" VARCHAR(128) NOT NULL,
    "initial" VARCHAR(32) NOT NULL,
    "profile_img_url" TEXT,
    "parent_id" INTEGER,

    CONSTRAINT "Association_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociationLeague" (
    "association_id" INTEGER NOT NULL,
    "league_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueSponser" (
    "league_id" INTEGER NOT NULL,
    "sponser_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Sponser" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "website_url" TEXT NOT NULL,
    "profile_img_url" TEXT,

    CONSTRAINT "Sponser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "association_id" INTEGER NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "global_name" VARCHAR(128) NOT NULL,
    "hometown" VARCHAR(128) NOT NULL,
    "initial" VARCHAR(16) NOT NULL,
    "established_at" TIMESTAMP(3) NOT NULL,
    "color" VARCHAR(16) NOT NULL,
    "subColor" VARCHAR(16),
    "profile_img_url" TEXT,
    "background_img_url" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamLeague" (
    "team_id" INTEGER NOT NULL,
    "league_id" INTEGER NOT NULL,
    "rank" SMALLINT
);

-- CreateTable
CREATE TABLE "Roster" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "global_name" VARCHAR(64) NOT NULL,
    "roster_type" "RosterType" NOT NULL,
    "team_id" INTEGER NOT NULL,
    "account_id" INTEGER,
    "register_year" TIMESTAMP(3) NOT NULL,
    "profile_img_url" TEXT NOT NULL,
    "status" "RosterStatus" NOT NULL DEFAULT 'Enable',

    CONSTRAINT "Roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Athlete" (
    "roster_id" INTEGER NOT NULL,
    "position" TEXT[],
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("roster_id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "league_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "home_team_id" INTEGER NOT NULL,
    "away_team_id" INTEGER NOT NULL,
    "result" "GameResult" NOT NULL,
    "stadium" VARCHAR(256) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefereeGame" (
    "referee_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "position" "RefereePosition" NOT NULL
);

-- CreateTable
CREATE TABLE "PressGame" (
    "press_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Score" (
    "game_id" INTEGER NOT NULL,
    "home_team_score" INTEGER,
    "home_team_quarter_scores" INTEGER[],
    "away_team_score" INTEGER,
    "away_team_quarter_scores" INTEGER[],
    "overtime" BOOLEAN,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "record_argument_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordArgument" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "unit" VARCHAR(32) NOT NULL,
    "version" SMALLINT NOT NULL,

    CONSTRAINT "RecordArgument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "OAuth_provider_id_provider_type_key" ON "OAuth"("provider_id", "provider_type");

-- CreateIndex
CREATE INDEX "parent_id_idx" ON "Association"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "AssociationLeague_association_id_league_id_key" ON "AssociationLeague"("association_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueSponser_league_id_sponser_id_key" ON "LeagueSponser"("league_id", "sponser_id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamLeague_team_id_league_id_key" ON "TeamLeague"("team_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "RefereeGame_referee_id_game_id_key" ON "RefereeGame"("referee_id", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "PressGame_press_id_game_id_key" ON "PressGame"("press_id", "game_id");

-- AddForeignKey
ALTER TABLE "OAuth" ADD CONSTRAINT "OAuth_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referee" ADD CONSTRAINT "Referee_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Press" ADD CONSTRAINT "Press_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAllow" ADD CONSTRAINT "NotificationAllow_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_post_type_id_fkey" FOREIGN KEY ("post_type_id") REFERENCES "PostType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Association" ADD CONSTRAINT "Association_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Association"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationLeague" ADD CONSTRAINT "AssociationLeague_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationLeague" ADD CONSTRAINT "AssociationLeague_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueSponser" ADD CONSTRAINT "LeagueSponser_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueSponser" ADD CONSTRAINT "LeagueSponser_sponser_id_fkey" FOREIGN KEY ("sponser_id") REFERENCES "Sponser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeague" ADD CONSTRAINT "TeamLeague_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeague" ADD CONSTRAINT "TeamLeague_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "Roster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefereeGame" ADD CONSTRAINT "RefereeGame_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "Referee"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefereeGame" ADD CONSTRAINT "RefereeGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PressGame" ADD CONSTRAINT "PressGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PressGame" ADD CONSTRAINT "PressGame_press_id_fkey" FOREIGN KEY ("press_id") REFERENCES "Press"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "Athlete"("roster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_record_argument_id_fkey" FOREIGN KEY ("record_argument_id") REFERENCES "RecordArgument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
