SELECT setval('"Game_id_seq"', (SELECT MAX(id) FROM "Game"));
