#!/bin/bash

export PYTHONIOENCODING=utf-8
mkdir Assets
cp -r  tests/testflows/tmp/target/ ./Assets
mkdir Reports
cp tests/testflows/raw.log  ./Reports/raw.log
tfs --debug --no-colors transform compact ./Reports/raw.log > ./Reports/compact.log
tfs --debug --no-colors transform nice ./Reports/raw.log   > ./Reports/nice.log.txt
tfs --debug --no-colors report results -a "$CI_JOB_URL/artifacts/browse" ./Reports/raw.log - --confidential --copyright "Altinity Inc" | tfs --debug --no-colors document convert > ./Reports/result.html
tfs --debug --no-colors report coverage - ./Reports/raw.log -  --confidential --copyright "Altinity Inc"  | tfs --debug --no-colors document convert > ./Reports/coverage.html