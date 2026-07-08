-- Script para resetar os dados do banco com segurança
TRUNCATE TABLE
    messages,
    events,
    purchases,
    subscriptions,
    leads
RESTART IDENTITY CASCADE;

VACUUM ANALYZE;