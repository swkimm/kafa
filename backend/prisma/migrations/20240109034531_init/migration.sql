-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Verifying', 'Enable', 'Disable');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('Naver', 'Kakao');

-- CreateEnum
CREATE TYPE "RosterStatus" AS ENUM ('Enable', 'Graduate', 'Disable', 'Verifying');

-- CreateEnum
CREATE TYPE "RosterType" AS ENUM ('Athlete', 'Staff', 'Coach', 'HeadCoach');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('HomeWin', 'AwayWin', 'Draw', 'NotFinished');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Manager', 'User');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('Enabled', 'Disabled');

-- CreateEnum
CREATE TYPE "TeamEnrollStatus" AS ENUM ('Received', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "LeagueApplyStatus" AS ENUM ('Received', 'Approved', 'Hold', 'Rejected');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('Male', 'Female', 'Others');

-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('Passer', 'Rusher', 'Receiver', 'Kicker', 'Safety');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Notice', 'Normal', 'Secret');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "username" VARCHAR(128) NOT NULL,
    "team_id" INTEGER,
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
CREATE TABLE "AccountCertification" (
    "account_id" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountCertification_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "AccountCredential" (
    "account_id" INTEGER NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "gender" "GenderType" NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountCredential_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "OAuth" (
    "account_id" INTEGER NOT NULL,
    "provider_id" VARCHAR(256) NOT NULL,
    "provider_type" "OAuthProvider" NOT NULL,

    CONSTRAINT "OAuth_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "content" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "type" "PostType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,

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
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "association_id" INTEGER,

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
    "deleted_at" TIMESTAMP(3),
    "status" "TeamStatus" NOT NULL DEFAULT 'Enabled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisterTeamRequest" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reject_reason" TEXT,
    "status" "TeamEnrollStatus" NOT NULL DEFAULT 'Received',

    CONSTRAINT "RegisterTeamRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamLeague" (
    "team_id" INTEGER NOT NULL,
    "league_id" INTEGER NOT NULL,
    "rank" SMALLINT,
    "applyStatus" "LeagueApplyStatus" NOT NULL DEFAULT 'Received',
    "reject_reason" TEXT
);

-- CreateTable
CREATE TABLE "LeagueRoster" (
    "league_id" INTEGER NOT NULL,
    "roster_id" INTEGER NOT NULL,
    "awards" JSONB
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
    "profile_img_url" TEXT,
    "status" "RosterStatus" NOT NULL DEFAULT 'Verifying',

    CONSTRAINT "Roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RosterCredentials" (
    "roster_id" INTEGER NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "gender" "GenderType" NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RosterCredentials_pkey" PRIMARY KEY ("roster_id")
);

-- CreateTable
CREATE TABLE "Athlete" (
    "roster_id" INTEGER NOT NULL,
    "position" JSONB NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "backNumber" INTEGER NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("roster_id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "league_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "home_team_id" INTEGER NOT NULL,
    "away_team_id" INTEGER NOT NULL,
    "stadium" VARCHAR(256) NOT NULL,
    "result" "GameResult" NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
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
    "roster_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "type" "RecordType" NOT NULL,
    "unit" VARCHAR(32) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_role_key" ON "Account"("email", "role");

-- CreateIndex
CREATE UNIQUE INDEX "OAuth_provider_id_provider_type_key" ON "OAuth"("provider_id", "provider_type");

-- CreateIndex
CREATE INDEX "parent_id_idx" ON "Association"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueSponser_league_id_sponser_id_key" ON "LeagueSponser"("league_id", "sponser_id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamLeague_team_id_league_id_key" ON "TeamLeague"("team_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueRoster_league_id_roster_id_key" ON "LeagueRoster"("league_id", "roster_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountCertification" ADD CONSTRAINT "AccountCertification_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountCredential" ADD CONSTRAINT "AccountCredential_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuth" ADD CONSTRAINT "OAuth_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Association" ADD CONSTRAINT "Association_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Association"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "Association"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueSponser" ADD CONSTRAINT "LeagueSponser_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueSponser" ADD CONSTRAINT "LeagueSponser_sponser_id_fkey" FOREIGN KEY ("sponser_id") REFERENCES "Sponser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_association_id_fkey" FOREIGN KEY ("association_id") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisterTeamRequest" ADD CONSTRAINT "RegisterTeamRequest_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeague" ADD CONSTRAINT "TeamLeague_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeague" ADD CONSTRAINT "TeamLeague_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRoster" ADD CONSTRAINT "LeagueRoster_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueRoster" ADD CONSTRAINT "LeagueRoster_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "Roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roster" ADD CONSTRAINT "Roster_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RosterCredentials" ADD CONSTRAINT "RosterCredentials_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "Roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "Roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "Athlete"("roster_id") ON DELETE CASCADE ON UPDATE CASCADE;
