import { themeData } from './helpers';

const tgiosVariables = (name: string, colors: string[]): string => {
    const {
        background,
        filling,
        themeIsLight,
        primary,
        secondaryText,
        text,
        textOnPrimary,
        bubbleOutColor: outgoingBubbleBackground,
    } = themeData(colors);

    const template = `
name: ${name}
basedOn: day
dark: ${!themeIsLight}
intro:
statusBar: ${themeIsLight ? 'white' : 'black'}
primaryText: ${text}
accentText: ${primary}
disabledText: 33${secondaryText}
startButton: ${primary}
dot: 5e5e5e
passcode:
  bg:
    top: ${background}
    bottom: ${background}
  button: clear
root:
  statusBar: ${themeIsLight ? 'white' : 'black'}
  tabBar:
    background: ${background}
    separator: 33${primary}
    icon: a1${primary}
    selectedIcon: ${primary}
    text: a1${primary}
    selectedText: ${primary}
    badgeBackground: ${text}
    badgeStroke: ${background}
    badgeText: ${background}
  navBar:
    button: ${primary}
    disabledButton: 33${primary}
    primaryText: ${text}
    secondaryText: ${secondaryText}
    control: ${primary}
    accentText: ${primary}
    background: ${background}
    separator: 33${primary}
    badgeFill: ${text}
    badgeStroke: ${background}
    badgeText: ffffff
  searchBar:
    background: ${background}
    accent: ${primary}
    inputFill: 33d6d6d6
    inputText: 000000
    inputPlaceholderText: a1${primary}
    inputIcon: 33000000
    inputClearButton: 7b7b81
    separator: 33${primary}
  keyboard: ${themeIsLight ? 'dark' : 'light'}
list:
  blocksBg: ${background}
  plainBg: ${background}
  primaryText: ${text}
  secondaryText: ${secondaryText}
  disabledText: 1e${primary}
  accent: ${primary}
  highlighted: 1e${primary}
  destructive: ff3b30
  placeholderText: c8c8ce
  itemBlocksBg: ${background}
  itemHighlightedBg: 1e${primary}
  blocksSeparator: 33${primary}
  plainSeparator: 33${primary}
  disclosureArrow: bab9be
  sectionHeaderText: 6d6d72
  freeText: 6d6d72
  freeTextError: cf3030
  freeTextSuccess: 26972c
  freeMonoIcon: 7e7e87
  switch:
    frame: e0e0e0
    handle: ffffff
    content: 77d572
    positive: 00c900
    negative: ff3b30
  disclosureActions:
    neutral1:
      bg: 4892f2
      fg: ffffff
    neutral2:
      bg: f09a37
      fg: ffffff
    destructive:
      bg: ff3824
      fg: ffffff
    constructive:
      bg: 00c900
      fg: ffffff
    accent:
      bg: ${primary}
      fg: ffffff
    warning:
      bg: ff9500
      fg: ffffff
    inactive:
      bg: bcbcc3
      fg: ffffff
  check:
    bg: ${primary}
    stroke: c7c7cc
    fg: ffffff
  controlSecondary: dedede
  freeInputField:
    bg: ${background}
    stroke: ${background}
    placeholder: 96979d
    primary: ${text}
    control: ${primary}
  mediaPlaceholder: e4e4e4
  scrollIndicator: 4c000000
  pageIndicatorInactive: e3e3e7
  inputClearButton: cccccc
chatList:
  bg: ${background}
  itemSeparator: 33${primary}
  itemBg: 1ed6d6d6
  pinnedItemBg: ${background}
  itemHighlightedBg: 1e${primary}
  itemSelectedBg: 1e${primary}
  title: ${text}
  secretTitle: 00b12c
  dateText: ${secondaryText}
  authorName: ${secondaryText}
  messageText: ${secondaryText}
  messageDraftText: ${secondaryText}
  checkmark: ${primary}
  pendingIndicator: ${secondaryText}
  failedFill: ff3b30
  failedFg: ffffff
  muteIcon: ${secondaryText}
  unreadBadgeActiveBg: ${primary}
  unreadBadgeActiveText: ${textOnPrimary}
  unreadBadgeInactiveBg: b6b6bb
  unreadBadgeInactiveText: ffffff
  pinnedBadge: ${primary}
  pinnedSearchBar: e5e5e5
  regularSearchBar: e9e9e9
  sectionHeaderBg: 33d6d6d6
  sectionHeaderText: 8e8e93
  verifiedIconBg: ${primary}
  verifiedIconFg: ffffff
  secretIcon: 00b12c
  pinnedArchiveAvatar:
    background:
      top: 1e${primary}
      bottom: ${primary}
    foreground: ffffff
  unpinnedArchiveAvatar:
    background:
      top: 1e${secondaryText}
      bottom: ${secondaryText}
    foreground: ffffff
  onlineDot: 4cc91f
chat:
  defaultWallpaper: ${background}
  message:
    incoming:
      bubble:
        withWp:
          bg: ${filling}
          highlightedBg: ccdadade
          stroke: ${filling}
        withoutWp:
          bg: ${filling}
          highlightedBg: ccdadade
          stroke: ${filling}
      primaryText: ${text}
      secondaryText: ${secondaryText}
      linkText: ${primary}
      linkHighlight: 1e${primary}
      scam: ff3b30
      textHighlight: 1e${primary}
      accentText: ${primary}
      accentControl: ${primary}
      mediaActiveControl: ${primary}
      mediaInactiveControl: cacaca
      pendingActivity: 99525252
      fileTitle: ${primary}
      fileDescription: 999999
      fileDuration: 99525252
      mediaPlaceholder: f2f2f2
      polls:
        radioButton: c8c7cc
        radioProgress: ${primary}
        highlight: 1e${primary}
        separator: c8c7cc
        bar: ${primary}
      actionButtonsBg:
        withWp: 66a5a5a5
        withoutWp: ccffffff
      actionButtonsStroke:
        withWp: clear
        withoutWp: ${primary}
      actionButtonsText:
        withWp: ffffff
        withoutWp: ${primary}
      textSelection: 4c${primary}
      textSelectionKnob: ${primary}
    outgoing:
      bubble:
        withWp:
          bg: ${outgoingBubbleBackground}
          highlightedBg: ccdadade
          stroke: ${outgoingBubbleBackground}
        withoutWp:
          bg: ${outgoingBubbleBackground}
          highlightedBg: ccdadade
          stroke: ${outgoingBubbleBackground}
      primaryText: ffffff
      secondaryText: a5ffffff
      linkText: ffffff
      linkHighlight: 4cffffff
      scam: ffffff
      textHighlight: 4cffffff
      accentText: ffffff
      accentControl: ffffff
      mediaActiveControl: ffffff
      mediaInactiveControl: a5ffffff
      pendingActivity: a5ffffff
      fileTitle: ffffff
      fileDescription: a5ffffff
      fileDuration: a5ffffff
      mediaPlaceholder: 0000f2
      polls:
        radioButton: a5ffffff
        radioProgress: ffffff
        highlight: 1effffff
        separator: a5ffffff
        bar: ffffff
      actionButtonsBg:
        withWp: 66a5a5a5
        withoutWp: ccffffff
      actionButtonsStroke:
        withWp: clear
        withoutWp: ${primary}
      actionButtonsText:
        withWp: ffffff
        withoutWp: ${primary}
      textSelection: 33ffffff
      textSelectionKnob: ffffff
    freeform:
      withWp:
        bg: e5e5ea
        highlightedBg: dadade
        stroke: e5e5ea
      withoutWp:
        bg: e5e5ea
        highlightedBg: dadade
        stroke: e5e5ea
    infoPrimaryText: 000000
    infoLinkText: 004bad
    outgoingCheck: ffffff
    mediaDateAndStatusBg: 7f000000
    mediaDateAndStatusText: ffffff
    shareButtonBg:
      withWp: 66a5a5a5
      withoutWp: ccffffff
    shareButtonStroke:
      withWp: clear
      withoutWp: e5e5ea
    shareButtonFg:
      withWp: ffffff
      withoutWp: ${primary}
    mediaOverlayControl:
      bg: 99000000
      fg: ffffff
    selectionControl:
      bg: ${primary}
      stroke: c7c7cc
      fg: ffffff
    deliveryFailed:
      bg: ff3b30
      fg: ffffff
    mediaHighlightOverlay: 99ffffff
  serviceMessage:
    components:
      withDefaultWp:
        bg: ccffffff
        primaryText: 8d8e93
        linkHighlight: 3f748391
        scam: ff3b30
        dateFillStatic: ccffffff
        dateFillFloat: ccffffff
      withCustomWp:
        bg: 66a5a5a5
        primaryText: ffffff
        linkHighlight: 3f748391
        scam: ff3b30
        dateFillStatic: 66a5a5a5
        dateFillFloat: 44a5a5a5
    unreadBarBg: ffffff
    unreadBarStroke: ffffff
    unreadBarText: 8d8e93
    dateText:
      withWp: ffffff
      withoutWp: 8d8e93
  inputPanel:
    panelBg: ${background}
    panelSeparator: 33${primary}
    panelControlAccent: ${primary}
    panelControl: ${secondaryText}
    panelControlDisabled: 1e${secondaryText}
    panelControlDestructive: ff3b30
    inputBg: 1ed6d6d6
    inputStroke: ${background}
    inputPlaceholder: 33${secondaryText}
    inputText: ${text}
    inputControl: ${primary}
    actionControlBg: ${primary}
    actionControlFg: ffffff
    primaryText: ${text}
    secondaryText: ${secondaryText}
    mediaRecordDot: ${primary}
    mediaRecordControl:
      button: ${primary}
      micLevel: 1e${primary}
      activeIcon: ffffff
  inputMediaPanel:
    panelSeparator: bec2c6
    panelIcon: 858e99
    panelHighlightedIconBg: 33858e99
    stickersBg: e8ebf0
    stickersSectionText: 9099a2
    stickersSearchBg: d9dbe1
    stickersSearchPlaceholder: 8e8e93
    stickersSearchPrimary: 000000
    stickersSearchControl: 8e8e93
    gifsBg: ffffff
  inputButtonPanel:
    panelBg: dee2e6
    panelSeparator: bec2c6
    buttonBg: ffffff
    buttonStroke: c3c7c9
    buttonHighlightedBg: a8b3c0
    buttonHighlightedStroke: c3c7c9
    buttonText: 000000
  historyNav:
    bg: ${background}
    stroke: ${background}
    fg: ${text}
    badgeBg: ${primary}
    badgeStroke: ${primary}
    badgeText: ffffff
actionSheet:
  dim: 66000000
  bgType: light
  opaqueItemBg: ffffff
  itemBg: ddffffff
  opaqueItemHighlightedBg: e5e5e5
  itemHighlightedBg: b2e5e5e5
  opaqueItemSeparator: e5e5e5
  standardActionText: ${primary}
  destructiveActionText: ff3b30
  disabledActionText: b3b3b3
  primaryText: 000000
  secondaryText: 5e5e5e
  controlAccent: ${primary}
  inputBg: e9e9e9
  inputHollowBg: ffffff
  inputBorder: e4e4e6
  inputPlaceholder: 818086
  inputText: 000000
  inputClearButton: 7b7b81
  checkContent: ffffff
contextMenu:
  dim: ${themeIsLight ? '33000a26' : '99000000'}
  background: ${themeIsLight ? 'c6f9f9f9' : 'c6252525'}
  itemSeparator: ${themeIsLight ? '333c3c43' : '26ffffff'}
  sectionSeparator: ${themeIsLight ? '338a8a8a' : '33000000'}
  itemBg: ${themeIsLight ? '00000000' : '00000000'}
  itemHighlightedBg: ${themeIsLight ? '333c3c43' : '26ffffff'}
  primary: ${themeIsLight ? '000000' : 'ffffff'}
  secondary: ${themeIsLight ? 'cc000000' : 'ccffffff'}
  destructive: ${themeIsLight ? 'ff3b30' : 'eb5545'}
notification:
  bg: ffffff
  primaryText: 000000
  expanded:
    bgType: light
    navBar:
      background: ffffff
      primaryText: 000000
      control: 7e8791
      separator: b1b1b1`;

    return template.replace(/#/g, '');
};

export default tgiosVariables;
