; Extra install steps for Moi Tracker
; Electron already contains everything the app needs. The only thing an old
; Windows 7 / 8 PC can be missing is the Microsoft Universal C Runtime, so the
; installer checks for it and installs it silently when it is not there.
!include "LogicLib.nsh"
!include "x64.nsh"

!macro customInstall
  ${IfNot} ${FileExists} "$SYSDIR\ucrtbase.dll"
    DetailPrint "Installing Microsoft Visual C++ runtime (needed on Windows 7 / 8)..."
    InitPluginsDir
    ${If} ${RunningX64}
      File /nonfatal "/oname=$PLUGINSDIR\vc_redist.exe" "${BUILD_RESOURCES_DIR}\redist\vc_redist.x64.exe"
    ${Else}
      File /nonfatal "/oname=$PLUGINSDIR\vc_redist.exe" "${BUILD_RESOURCES_DIR}\redist\vc_redist.x86.exe"
    ${EndIf}
    ${If} ${FileExists} "$PLUGINSDIR\vc_redist.exe"
      ExecWait '"$PLUGINSDIR\vc_redist.exe" /install /quiet /norestart' $0
    ${EndIf}
  ${EndIf}
!macroend
