@echo off
setlocal enabledelayedexpansion
echo ================================
echo DELETING OBSOLETE FILES
echo ================================
echo.

set "count=0"

:: Delete obsolete documentation files
call :DeleteFile "QUICK_WINS_COMPLETE.md"
call :DeleteFile "SYNTAX_ERROR_FIX.md"
call :DeleteFile "IMPLEMENTATION-COMPLETE.md"
call :DeleteFile "IMPLEMENTATION-STATUS.md"
call :DeleteFile "ROLLBACK-UX-IMPROVEMENTS.md"
call :DeleteFile "DESKTOP-CONVERSION-COMPLETE.md"
call :DeleteFile "QUICK-WINS-PROGRESS.md"
call :DeleteFile "CLEANUP-SUMMARY.md"

:: Delete old test files
call :DeleteFile "test_vertex_auth.js"
call :DeleteFile "test_vertex_api.ps1"
call :DeleteFile "test_vertex_ai_key.py"
call :DeleteFile "test_api_key.py"

:: Delete old backup and unused files
call :DeleteFile "orig-fallback.js"
call :DeleteFile "streamlit_app.py"
call :DeleteFile "performance-resource-hints.html"
call :DeleteFile "test_key.html"
call :DeleteFile "readme-troubleshoot.md"
call :DeleteFile "ENTERPRISE-REVIEW.md"

echo.
echo ================================
echo DELETION COMPLETE
echo ================================
echo Total files deleted: %count%
echo.
echo Press any key to exit...
pause >nul
exit /b

:DeleteFile
if exist "%~1" (
    del /f "%~1"
    if not exist "%~1" (
        echo [OK] Deleted: %~1
        set /a count+=1
    ) else (
        echo [ERROR] Failed to delete: %~1
    )
) else (
    echo [SKIP] Not found: %~1
)
exit /b
