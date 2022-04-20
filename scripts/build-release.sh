#!/bin/bash

set -euox pipefail

SCRIPTPATH="$(cd -- "$(dirname "$0")" >/dev/null 2>&1; pwd -P)"
ROOT="$(dirname "$SCRIPTPATH")"

COLOR_RED="\033[31m"
COLOR_GREEN="\033[32m"
COLOR_YELLOW="\033[33m"
COLOR_BLUE="\033[34m"
COLOR_NORMAL="\033[39m"

BFX_API_URL="https://api-pub.bitfinex.com"
STAGING_BFX_API_URL="https://api.staging.bitfinex.com"

programname=$0
countReqOSs=0
bfxApiUrl="$BFX_API_URL"

buildLinux=0
buildWin=0
buildMac=0
isBfxApiStaging=0
isDevEnv=0

function usage {
  echo -e "\
\n${COLOR_GREEN}Usage: $programname [options] [-h]${COLOR_BLUE}
\nOptions:
  -l    Build Linux release
  -w    Build Windows release
  -m    Build Mac release
  -s    Use staging BFX API
  -d    Set development environment
  -h    Display help\
${COLOR_NORMAL}" 1>&2
}

if [ $# == 0 ]; then
  echo -e "\n${COLOR_RED}Requires at least one option!${COLOR_NORMAL}" >&2
  usage
  exit 1
fi

while getopts "lwmsdh" opt; do
  case "${opt}" in
    l) buildLinux=1;;
    w) buildWin=1;;
    m) buildMac=1;;
    s) isBfxApiStaging=1;;
    d) isDevEnv=1;;
    h)
      usage
      exit 0
      ;;
    *)
      echo -e "\n${COLOR_RED}No reasonable options found!${COLOR_NORMAL}" >&2
      usage
      exit 1
      ;;
  esac
done

declare -a areqOSArr=(
  $buildLinux
  $buildWin
  $buildMac
)

for i in "${areqOSArr[@]}"; do
  if [ $i == 1 ]; then
    ((countReqOSs+=1))
  fi
  if [[ $countReqOSs > 1 ]]; then
    echo -e "\n${COLOR_RED}A release for only one OS may be required!${COLOR_NORMAL}" >&2
    exit 1
  fi
done

if [ $countReqOSs != 1 ]; then
  echo -e "\n${COLOR_RED}A release for at least one OS may be required!${COLOR_NORMAL}" >&2
  exit 1
fi

if [ $isBfxApiStaging == 1 ]; then
  bfxApiUrl="$STAGING_BFX_API_URL"
fi
if [ $isDevEnv == 1 ]; then
  echo -e "\n${COLOR_YELLOW}Developer environment is turned on!${COLOR_NORMAL}"
fi
