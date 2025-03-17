#!/bin/bash
cd "$(dirname "$0")/../.."
npx vitest run src/kittens/domain/**/*.spec.ts src/kittens/tests/**/*.spec.ts
