const { isLight, adjustBrightness, mixBrightness, themeData } = require(`./helpers`);

module.exports = (name, colors) => {
    const {
        author,
        background,
        filling,
        isLightTheme,
        primary,
        secondaryText,
        text,
        textOnPrimary,
        backgroundText,
    } = themeData(colors);

    return `
        !
        name: "${name}"
        author: "${author}"
        @
        shadowDepth: ${isLightTheme ? .65 : 1}
        wallpaperId: 0
        lightStatusBar: ${isLight(primary) ? 1 : 0}
        dark: ${isLightTheme ? 0 : 1}
        parentTheme: ${isLightTheme ? 11 : 10}
        wallpaperUsageId: 2
        #
        background: ${background}
        background_text, background_textLight, background_icon: ${backgroundText}

        headerLightBackground: ${filling}
        headerLightIcon, headerLightText: ${text}

        headerBackground, iconActive, progress, controlActive, checkActive, sliderActive, togglerActive, inputActive, inlineIcon, inlineOutline, bubbleOut_inlineOutline, inlineText, bubbleOut_inlineText, bubbleOut_inlineIcon, ticks, ticksRead, bubbleOut_ticks, bubbleOut_ticksRead, bubbleOut_file, file, bubbleOut_waveformActive, waveformActive, bubbleIn_textLink, bubbleOut_textLink, textLink, chatSendButton, textSearchQueryHighlight, profileSectionActive, profileSectionActiveContent, badge, bubbleOut_chatVerticalLine, messageVerticalLine, bubbleOut_messageAuthor, messageAuthor, messageSwipeBackground, unreadText, bubble_unreadText, bubble_unreadText_noWallpaper textNeutral, seekDone, promo, online, playerButtonActive, chatListVerify, fillingPositive, passcode, notification, notificationSecure, headerBarCallActive, fileAttach: ${primary}

        headerTabActiveText, headerTabActive, headerText, headerIcon, messageSwipeContent, passcodeIcon, passcodeText, fillingPositiveContent, attachText, chatListAction: ${textOnPrimary}

        circleButtonRegular, circleButtonTheme: ${primary}
        circleButtonNewSecret, fileGreen: ${adjustBrightness(primary, 3)}
        circleButtonNewChannel, fileYellow: ${adjustBrightness(primary, 5.5)}
        circleButtonNewGroup: ${adjustBrightness(primary, 12)}
        circleButtonNewChat, fileRed: ${adjustBrightness(primary, 6.3)}
        circleButtonChat, circleButtonOverlay: ${filling}
        circleButtonChatIcon, circleButtonOverlayIcon, bubbleIn_time, bubbleOut_time, bubbleOut_progress: ${secondaryText}

        controlInactive, headerRemoveBackgroundHighlight, introSectionActive, playerButton, text: ${text}

        avatarCyan, nameCyan, attachContact: ${mixBrightness(primary, isLightTheme, 17)}
        avatarBlue, nameBlue: ${mixBrightness(primary, isLightTheme, 15)}
        avatarGreen, nameGreen, attachFile: ${mixBrightness(primary, isLightTheme, 10)}
        avatarViolet, nameViolet: ${mixBrightness(primary, isLightTheme, 5)}
        avatarRed, nameRed, attachPhoto: ${mixBrightness(primary, isLightTheme, -5)}
        avatarPink, namePink, attachLocation: ${mixBrightness(primary, isLightTheme, -10)}
        avatarYellow, nameYellow, attachInlineBot: ${mixBrightness(primary, isLightTheme, -15)}
        avatarOrange, nameOrange: ${mixBrightness(primary, isLightTheme, -17)}
        avatarSavedMessages: ${primary}

        bubbleIn_background, chatBackground, chatKeyboard, checkContent, controlContent, filling, headerButton, inlineContentActive, overlayFilling, placeholder, promoContent: ${filling}

        chatKeyboardButton, inputInactive, introSection, sliderInactive, textLight, chatListMute, icon, iconLight, headerButtonIcon, playerCoverIcon: ${secondaryText}

        bubbleIn_textLinkPressHighlight, textSelectionHighlight, bubbleOut_textLinkPressHighlight, textLinkPressHighlight: ${primary}31

        bubbleOut_background: ${adjustBrightness(isLightTheme ? primary : filling, isLightTheme ? 41 : -3)}
        fillingPressed: ${secondaryText}31
        messageSelection, bubble_messageSelectionNoWallpaper: ${primary}24
        bubble_messageSelection: ${primary}48
        headerRemoveBackground: ${text}96
        bubble_messageCheckOutline, bubble_messageCheckOutlineNoWallpaper: ${text}42
        bubbleOut_waveformInactive, waveformInactive: ${secondaryText}74
        bubbleOut_text, bubbleIn_text: ${text}
        seekEmpty, seekReady, playerCoverPlaceholder: ${text}19
        headerTabInactiveText: ${textOnPrimary}97
        togglerActiveBackground: ${primary}97
        unread, bubble_unread, bubble_unread_noWallpaper: ${primary}18
        textPlaceholder: ${text}66
        previewBackground: ${filling}C0
        togglerInactive: ${mixBrightness(secondaryText, isLightTheme, 10)}
        togglerInactiveBackground: ${mixBrightness(secondaryText, isLightTheme, 10)}64
        badgeText: ${textOnPrimary}
        badgeMuted: ${text}65
        badgeMutedText: ${filling}
        separator: #00000023
        `;
};
