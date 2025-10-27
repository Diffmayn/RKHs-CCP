; Custom installer script for NSIS
; Includes Citrix compatibility and network setup

!include "MUI2.nsh"
!include "FileAssociation.nsh"

; App details
!define APP_NAME "RKH's Photo Order Management"
!define APP_COMPANY "RKH's CCP"
!define APP_VERSION "1.0.0"
!define APP_DESCRIPTION "Professional Photo Order Management System"

; Request application privileges
RequestExecutionLevel admin

; Modern UI settings
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_NAME}.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch ${APP_NAME}"
!define MUI_FINISHPAGE_LINK "Visit project website"
!define MUI_FINISHPAGE_LINK_LOCATION "https://github.com/Diffmayn/RKHs-CCP"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\LICENSE"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

Section "Main Application" SecMain
    SectionIn RO
    
    ; Create installation directory
    SetOutPath "$INSTDIR"
    
    ; Install main files
    File /r "${srcdir}\*.*"
    
    ; Create desktop shortcut
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe"
    
    ; Create start menu entries
    CreateDirectory "$SMPROGRAMS\${APP_COMPANY}"
    CreateShortCut "$SMPROGRAMS\${APP_COMPANY}\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe"
    CreateShortCut "$SMPROGRAMS\${APP_COMPANY}\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
    
    ; Register uninstaller
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    
    ; Registry entries for uninstaller
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "InstallLocation" "$INSTDIR"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayIcon" "$INSTDIR\${APP_NAME}.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "Publisher" "${APP_COMPANY}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoModify" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoRepair" 1
SectionEnd

Section "Citrix Optimization" SecCitrix
    ; Citrix-specific registry settings for better performance
    WriteRegStr HKCU "Software\${APP_COMPANY}\${APP_NAME}" "CitrixOptimized" "true"
    WriteRegStr HKCU "Software\${APP_COMPANY}\${APP_NAME}" "ReduceAnimations" "true"
    WriteRegStr HKCU "Software\${APP_COMPANY}\${APP_NAME}" "NetworkMode" "optimized"
    
    ; Create Citrix-optimized shortcut
    CreateShortCut "$DESKTOP\${APP_NAME} (Citrix).lnk" "$INSTDIR\${APP_NAME}.exe" "--citrix-mode"
SectionEnd

Section "Network Service" SecNetwork
    ; Configure Windows Firewall exceptions
    nsExec::ExecToLog 'netsh advfirewall firewall add rule name="${APP_NAME} Server" dir=in action=allow protocol=TCP localport=8080'
    nsExec::ExecToLog 'netsh advfirewall firewall add rule name="${APP_NAME} WebSocket" dir=in action=allow protocol=TCP localport=8081'
    
    ; Register URL protocol
    WriteRegStr HKCR "rkhs" "" "URL:RKH Photo Order Protocol"
    WriteRegStr HKCR "rkhs" "URL Protocol" ""
    WriteRegStr HKCR "rkhs\DefaultIcon" "" "$INSTDIR\${APP_NAME}.exe,1"
    WriteRegStr HKCR "rkhs\shell\open\command" "" "$INSTDIR\${APP_NAME}.exe %1"
SectionEnd

; Component descriptions
LangString DESC_SecMain ${LANG_ENGLISH} "Main application files (required)"
LangString DESC_SecCitrix ${LANG_ENGLISH} "Optimizations for Citrix environments"
LangString DESC_SecNetwork ${LANG_ENGLISH} "Network service configuration and firewall rules"

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
!insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
!insertmacro MUI_DESCRIPTION_TEXT ${SecCitrix} $(DESC_SecCitrix)
!insertmacro MUI_DESCRIPTION_TEXT ${SecNetwork} $(DESC_SecNetwork)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

Section "Uninstall"
    ; Remove files
    RMDir /r "$INSTDIR"
    
    ; Remove shortcuts
    Delete "$DESKTOP\${APP_NAME}.lnk"
    Delete "$DESKTOP\${APP_NAME} (Citrix).lnk"
    RMDir /r "$SMPROGRAMS\${APP_COMPANY}"
    
    ; Remove registry entries
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
    DeleteRegKey HKCU "Software\${APP_COMPANY}"
    DeleteRegKey HKCR "rkhs"
    
    ; Remove firewall rules
    nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="${APP_NAME} Server"'
    nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="${APP_NAME} WebSocket"'
SectionEnd
