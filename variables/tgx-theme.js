const isLight = require(`./isLight`);

const ensureLength = hex => hex.length === 6 ? hex : hex.split(``).map(c => c.repeat(2)).join(``);

module.exports = (name, colors) => {
    colors = colors.map(color => ensureLength(color.slice(1)));
    const [bg, text, secondaryText] = colors;
    const isBgLight = isLight(bg);

    return `
        !
        name: "${name}"
        author: "${process.env.USERNAME}"
        @
        bubbleOutline, bubbleUnreadShadow, shadowDepth: 1
        wallpaperId: 0
        lightStatusBar: ${isBgLight ? 1 : 0}
        dark: ${isBgLight ? 0 : 1}
        parentTheme: 11
        wallpaperUsageId: 2
        #
        attachContact, attachFile, attachInlineBot, attachLocation, attachPhoto, avatarBlue, avatarCyan, avatarGreen, avatarInactive, avatarOrange, avatarPink, avatarRed, avatarSavedMessages, avatarViolet, avatarYellow, background_icon, badge, badgeFailed, bubble_messageCheckOutline, bubble_messageCheckOutlineNoWallpaper, bubbleIn_outline, bubbleIn_text, bubbleIn_time, bubbleOut_chatVerticalLine, bubbleOut_file, bubbleOut_inlineOutline, bubbleOut_inlineText, bubbleOut_messageAuthor, bubbleOut_outline, bubbleOut_text, bubbleOut_ticks, bubbleOut_ticksRead, bubbleOut_time, bubbleOut_waveformActive, chatListAction, chatListMute, chatListVerify, chatSendButton, checkActive, circleButtonChat, circleButtonNegative, circleButtonNewChannel, circleButtonNewChat, circleButtonNewGroup, circleButtonNewSecret, circleButtonOverlay, circleButtonPositive, circleButtonRegular, circleButtonTheme, controlActive, controlInactive, file, fileAttach, fileGreen, fileRed, fileYellow, fillingNegative, fillingPositive, headerButton, headerIcon, headerLightIcon, headerLightText, headerRemoveBackgroundHighlight, headerTabActiveText, headerTabActive, headerText, icon, iconActive, iconLight, iconNegative, iconPositive, inlineIcon, inlineOutline, inlineText, inputActive, inputNegative, inputPositive, introSectionActive, messageAuthor, messageVerticalLine, nameBlue, nameCyan, nameGreen, nameOrange, namePink, nameRed, nameViolet, nameYellow, online, playerButton, playerCoverIcon, profileSectionActive, profileSectionActiveContent, progress, promo, seekDone, sliderActive, text, textNegative, textNeutral, textPlaceholder, textSecure, ticks, ticksRead, togglerActive, togglerInactive, togglerNegative, togglerPositive, waveformActive: #${text}
        attachText, background, badgeFailedText, badgeMutedText, badgeText, bubbleIn_background, bubbleOut_background, chatBackground, chatKeyboard, checkContent, circleButtonChatIcon, circleButtonNegativeIcon, circleButtonNewChannelIcon, circleButtonNewChatIcon, circleButtonNewGroupIcon, circleButtonNewSecretIcon, circleButtonOverlayIcon, circleButtonPositiveIcon, circleButtonRegularIcon, circleButtonThemeIcon, controlContent, filling, fillingPositiveContent, headerBackground, headerButtonIcon, headerLightBackground, inlineContentActive, overlayFilling, placeholder, playerCoverPlaceholder, promoContent, togglerNegativeContent, togglerPositiveContent: #${bg}
        badgeMuted: #${text}4B
        togglerActiveBackground, togglerInactiveBackground, togglerNegativeBackground, togglerPositiveBackground: #${text}64
        bubble_messageSelectionNoWallpaper, bubbleIn_textLinkPressHighlight, bubbleOut_textLinkPressHighlight, textLinkPressHighlight, textSelectionHighlight: #${text}31
        bubbleIn_textLink, bubbleOut_textLink, bubbleOut_waveformInactive, chatKeyboardButton, inputInactive, introSection, playerButtonActive, seekReady, sliderInactive, textLight, textLink, textSearchQueryHighlight, waveformInactive: #${secondaryText}
        fillingPressed: #${secondaryText}31
        bubble_messageSelection, messageSelection: #${text}16
        headerRemoveBackground: #${text}96
        headerTabInactiveText: #${text}CC
        seekEmpty: #${secondaryText}96
        previewBackground: ${bg}C0
        separator: #0000
    `;
};
