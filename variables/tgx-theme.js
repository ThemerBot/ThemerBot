const Color = require(`color`);
const { isLight, adjustBrightness: adjust, mixBrightness: mix, getFgColor } = require(`./helpers`);

module.exports = (name, colors) => {
    const [filling, text, secondaryText, primary] = colors,
        isLightTheme = Color(filling).isLight(),
        textOnPrimary = getFgColor(primary),
        background = adjust(filling, -6.5);

    return `
        !
        name: "${name}"
        author: "${process.env.BOT_USERNAME}"
        @
        shadowDepth: ${isLightTheme ? .65 : 1}
        wallpaperId: 0
        lightStatusBar: ${isLight(primary) ? 1 : 0}
        dark: ${isLightTheme ? 0 : 1}
        parentTheme: ${isLightTheme ? 11 : 10}
        wallpaperUsageId: 2
        #
        background: ${background}
        background_text, background_textLight, background_icon: ${mix(text, isLightTheme, -5)}

        headerLightBackground: ${filling}
        headerLightIcon, headerLightText: ${text}

        headerBackground, iconActive, progress, controlActive, checkActive, sliderActive, togglerActive, inputActive, inlineIcon, inlineOutline, bubbleOut_inlineOutline, inlineText, bubbleOut_inlineText, bubbleOut_inlineIcon, ticks, ticksRead, bubbleOut_ticks, bubbleOut_ticksRead, bubbleOut_file, file, bubbleOut_waveformActive, waveformActive, bubbleIn_textLink, bubbleOut_textLink, textLink, chatSendButton, textSearchQueryHighlight, profileSectionActive, profileSectionActiveContent, badge, bubbleOut_chatVerticalLine, messageVerticalLine, bubbleOut_messageAuthor, messageAuthor, messageSwipeBackground, unreadText, bubble_unreadText, textNeutral, seekDone, promo, online, playerButtonActive, chatListVerify, fillingPositive, passcode, notification, notificationSecure, headerBarCallActive, fileAttach: ${primary}

        headerTabActiveText, headerTabActive, headerText, headerIcon, messageSwipeContent, passcodeIcon, passcodeText, fillingPositiveContent, attachText: ${textOnPrimary}

        circleButtonRegular, circleButtonTheme: ${primary}
        circleButtonNewSecret, fileGreen: ${adjust(primary, 10)}
        circleButtonNewChannel, fileYellow: ${adjust(primary, 20)}
        circleButtonNewGroup: ${adjust(primary, 30)}
        circleButtonNewChat, fileRed: ${adjust(primary, 40)}
        circleButtonChat, circleButtonOverlay: ${filling}
        circleButtonChatIcon, circleButtonOverlayIcon, bubbleIn_time, bubbleOut_time, bubbleOut_progress: ${secondaryText}

        controlInactive, headerRemoveBackgroundHighlight, introSectionActive, playerButton, text: ${text}

        avatarCyan, nameCyan, attachContact: ${mix(primary, isLightTheme, 20)}
        avatarBlue, nameBlue: ${mix(primary, isLightTheme, 15)}
        avatarGreen, nameGreen, attachFile: ${mix(primary, isLightTheme, 10)}
        avatarViolet, nameViolet: ${mix(primary, isLightTheme, 5)}
        avatarRed, nameRed, attachPhoto: ${mix(primary, isLightTheme, -5)}
        avatarPink, namePink, attachLocation: ${mix(primary, isLightTheme, -10)}
        avatarYellow, nameYellow, attachInlineBot: ${mix(primary, isLightTheme, -15)}
        avatarOrange, nameOrange: ${mix(primary, isLightTheme, -20)}
        avatarSavedMessages: ${primary}

        bubbleIn_background, bubbleOut_background, chatBackground, chatKeyboard, checkContent, controlContent, filling, headerButton, inlineContentActive, overlayFilling, placeholder, promoContent: ${filling}

        chatKeyboardButton, inputInactive, introSection, sliderInactive, textLight, chatListMute, icon, iconLight, chatListAction, headerButtonIcon, playerCoverIcon: ${secondaryText}

        bubbleIn_textLinkPressHighlight, textSelectionHighlight, bubbleOut_textLinkPressHighlight, textLinkPressHighlight: ${primary}31

        fillingPressed: ${secondaryText}31
        messageSelection, bubble_messageSelectionNoWallpaper: ${primary}13
        bubble_messageSelection: ${primary}23
        headerRemoveBackground: ${text}96
        bubble_messageCheckOutline, bubble_messageCheckOutlineNoWallpaper: ${text}42
        bubbleOut_waveformInactive, waveformInactive: ${secondaryText}74
        bubbleOut_text, bubbleIn_text: ${text}
        seekEmpty, seekReady, playerCoverPlaceholder: ${text}19
        headerTabInactiveText: ${textOnPrimary}97
        togglerActiveBackground: ${primary}97
        unread, bubble_unread: ${primary}18
        textPlaceholder: ${text}66
        previewBackground: ${filling}C0
        togglerInactive: ${mix(secondaryText, isLightTheme, 10)}
        togglerInactiveBackground: ${mix(secondaryText, isLightTheme, 10)}64
        badgeText: ${textOnPrimary}
        badgeMuted: ${text}65
        badgeMutedText: ${filling}
        separator: #00000023
        `;
};
