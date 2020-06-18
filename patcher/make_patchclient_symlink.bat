@echo off

set PATCH_CLIENT_TARGET_DIR="%PROGRAMDATA%\CSE\Camelot Unchained"

REM Make sure this script is being run from the correct directory
for %%I in (.) do set CurDirName=%%~nxI
if not %CurDirName% EQU patcher (
    echo This script must be run from the UI repo's patcher directory.
    echo Current directory name: %CurDirName%
    goto :FAIL
)

if not exist src (
    echo Can't find src directory, are you sure this script is being run from the UI repo's patcher directory?
    goto :FAIL
)

set is_symlink=0
fsutil reparsePoint query "PatchClient" | find "Mount Point" >nul && set is_symlink=1

if exist PatchClient (
    REM Is PatchClient is a directory?
    if exist PatchClient\NUL (
        REM Is PatchClient a symlink?
        if %is_symlink% EQU 1 (
            echo PatchClient symlink already exists.
            goto :EOF
        ) else (
            echo PatchClient exists but is not a symlink to the actual patch client.
            echo Please delete it and run this script again.
            goto :FAIL
        )
    ) else (
        echo PatchClient exists but is not a directory.
        echo Please delete it and run this script again.
        goto :FAIL
    )
) else (
    mklink /j PatchClient %PATCH_CLIENT_TARGET_DIR%
    exit /B 0
)

goto :EOF
:FAIL
echo Failed
exit /B 1
