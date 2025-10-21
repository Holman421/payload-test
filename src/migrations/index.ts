import * as migration_20251020_225358 from './20251020_225358';
import * as migration_20251020_232331 from './20251020_232331';
import * as migration_20251020_233109 from './20251020_233109';

export const migrations = [
  {
    up: migration_20251020_225358.up,
    down: migration_20251020_225358.down,
    name: '20251020_225358',
  },
  {
    up: migration_20251020_232331.up,
    down: migration_20251020_232331.down,
    name: '20251020_232331',
  },
  {
    up: migration_20251020_233109.up,
    down: migration_20251020_233109.down,
    name: '20251020_233109'
  },
];
