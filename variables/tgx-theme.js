const isLight = require(`./isLight`);

module.exports = (name, colors) => {
    colors = colors.map(color => color.slice(1));
    const isBgLight = isLight(colors[0]);

    return `
        !
        name: "${name}"
        author: "${process.env.USERNAME}"
        @
        bubbleOutline, bubbleUnreadShadow, replaceShadowsWithSeparators, shadowDepth: 1
        wallpaperId: 0
        lightStatusBar: ${isBgLight ? 1 : 0}
        dark: ${isBgLight ? 0 : 1}
        parentTheme: 11
        wallpaperUsageId: 2
        #
        attachContact, attachFile, attachInlineBot, attachLocation, attachPhoto, avatarBlue, avatarCyan, avatarGreen, avatarInactive, avatarOrange, avatarPink, avatarRed, avatarSavedMessages, avatarViolet, avatarYellow, background_icon, badge, badgeFailed, bubble_messageCheckOutline, bubble_messageCheckOutlineNoWallpaper, bubbleIn_outline, bubbleIn_text, bubbleIn_time, bubbleOut_chatVerticalLine, bubbleOut_file, bubbleOut_inlineOutline, bubbleOut_inlineText, bubbleOut_messageAuthor, bubbleOut_outline, bubbleOut_text, bubbleOut_ticks, bubbleOut_ticksRead, bubbleOut_time, bubbleOut_waveformActive, chatListAction, chatListMute, chatListVerify, chatSendButton, checkActive, circleButtonChat, circleButtonNegative, circleButtonNewChannel, circleButtonNewChat, circleButtonNewGroup, circleButtonNewSecret, circleButtonOverlay, circleButtonPositive, circleButtonRegular, circleButtonTheme, controlActive, controlInactive, file, fileAttach, fileGreen, fileRed, fileYellow, fillingNegative, fillingPositive, headerButton, headerIcon, headerLightIcon, headerLightText, headerRemoveBackgroundHighlight, headerTabActiveText, headerText, icon, iconActive, iconLight, iconNegative, iconPositive, inlineIcon, inlineOutline, inlineText, inputActive, inputNegative, inputPositive, introSectionActive, messageAuthor, messageVerticalLine, nameBlue, nameCyan, nameGreen, nameOrange, namePink, nameRed, nameViolet, nameYellow, online, playerButton, playerCoverIcon, profileSectionActive, profileSectionActiveContent, progress, promo, seekDone, sliderActive, text, textNegative, textNeutral, textPlaceholder, textSecure, ticks, ticksRead, togglerActive, togglerInactive, togglerNegative, togglerPositive, waveformActive: #${colors[1]}
        attachText, background, badgeFailedText, badgeMutedText, badgeText, bubbleIn_background, bubbleOut_background, chatBackground, chatKeyboard, checkContent, circleButtonChatIcon, circleButtonNegativeIcon, circleButtonNewChannelIcon, circleButtonNewChatIcon, circleButtonNewGroupIcon, circleButtonNewSecretIcon, circleButtonOverlayIcon, circleButtonPositiveIcon, circleButtonRegularIcon, circleButtonThemeIcon, controlContent, filling, fillingPositiveContent, headerBackground, headerButtonIcon, headerLightBackground, headerTabActive, inlineContentActive, overlayFilling, placeholder, playerCoverPlaceholder, promoContent, togglerNegativeContent, togglerPositiveContent: #${colors[0]}
        badgeMuted: #${colors[1]}4B
        bubble_messageSelection: #${colors[1]}64
        bubble_messageSelectionNoWallpaper, bubbleIn_textLinkPressHighlight, bubbleOut_textLinkPressHighlight, textLinkPressHighlight, textSelectionHighlight: #${colors[1]}31
        bubbleIn_textLink, bubbleOut_textLink, bubbleOut_waveformInactive, chatKeyboardButton, inputInactive, introSection, playerButtonActive, seekReady, sliderInactive, textLight, textLink, textSearchQueryHighlight, waveformInactive: #${colors[2]}
        fillingPressed: #${colors[2]}31
        headerRemoveBackground, togglerActiveBackground, togglerInactiveBackground, togglerNegativeBackground, togglerPositiveBackground: #${colors[1]}96
        headerTabInactiveText: #${colors[1]}CC
        seekEmpty: #${colors[2]}96
        previewBackground: ${colors[0]}C0
        separator: #0000
    `;
};
