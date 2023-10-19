#!/bin/sh
npx prisma migrate deploy
node dist/apps/main.js
