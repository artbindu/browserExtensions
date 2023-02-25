// import worldTimes from './config';

const worldTimes = {
    tokyo: {
        timezone: 'Asia/Tokyo',
        text: 'Tokyo'
    }
};

const getDims = (elm, removeBorder = true, removePadding = true) => {
    const elmStyles = window.getComputedStyle(elm)
    return {
        height: elm.offsetHeight +
            (removeBorder ? -parseInt(elmStyles.borderTopWidth, 10) - parseInt(elmStyles.borderBottomWidth, 10) : 0) +
            (removePadding ? -parseInt(elmStyles.paddingTop, 10) - parseInt(elmStyles.paddingBottom, 10) : 0), width: elm.offsetWidth +
                (removeBorder ? -parseInt(elmStyles.borderLeftWidth, 10) - parseInt(elmStyles.borderRightWidth, 10) : 0) +
                (removePadding ? -parseInt(elmStyles.paddingLeft, 10) - parseInt(elmStyles.paddingRight, 10) : 0)
    }
}
const clockwiseRotate = (center, angle, point) => {
    const movex = point.x - center.x
    const movey = point.y - center.y
    const s = Math.sin(angle * Math.PI / 180)
    const c = Math.cos(angle * Math.PI / 180)
    const x = movex * c - movey * s
    const y = movex * s + movey * c
    return { x: x + center.x, y: y + center.y }
}

function init(type) {
    let clock = document.getElementsByClassName(`clock-${type}`)[0]
    let { height: boxH, width: boxW } = getDims(clock, false, false)
    let minv = Math.min(boxH, boxW)
    clock.style.height = clock.style.width = minv
    let { height, width } = getDims(clock)
    let dialHours = document.getElementsByClassName(`clock-${type}__dial-hour`)
    let offsetFix = dialHours[11].offsetHeight / 10
    let refx = 0
    let refy = -height / 2 + dialHours[11].offsetHeight / 2
    let origin = { x: 0, y: 0 }
    for (let i = 1; i <= 12; ++i) {
        let newc = clockwiseRotate(origin, 30, { x: refx, y: refy })
        refx = Math.round(newc.x)
        refy = Math.round(newc.y)
        newc.x = Math.round(newc.x - dialHours[i - 1].offsetWidth / 2 + width / 2)
        newc.y = Math.round(newc.y - dialHours[i - 1].offsetHeight / 2 + height / 2 + offsetFix)
        dialHours[i - 1].style.top = newc.y + 'px'
        dialHours[i - 1].style.left = newc.x + 'px'
    }
    let handPivot = document.getElementById(`hand-pivot-${type}`)
    let pivotBoxDims = getDims(handPivot, false, false)
    handPivot.style.top = height / 2 - pivotBoxDims.height / 2 + 'px'
    handPivot.style.left = width / 2 - pivotBoxDims.width / 2 + 'px'
    let hoursHand = document.getElementById(`hours-hand-${type}`)
    let minutesHand = document.getElementById(`minutes-hand-${type}`)
    let secondsHand = document.getElementById(`seconds-hand-${type}`)
    let offByPivot = 0.05 * height
    let hoursHandDims = getDims(hoursHand, false, false)
    hoursHand.style.top = 1.6 * dialHours[11].offsetHeight + 'px'
    hoursHand.style.left = width / 2 - hoursHandDims.width / 2 + 'px'
    hoursHand.style.height = (height / 2 - 1.6 * dialHours[11].offsetHeight + offByPivot) + 'px'
    hoursHand.style.transformOrigin = `${hoursHandDims.width / 2}px ${hoursHand.offsetHeight - offByPivot}px`
    let minutesHandDims = getDims(minutesHand, false, false)
    minutesHand.style.top = 1.2 * dialHours[11].offsetHeight + 'px'
    minutesHand.style.left = width / 2 - minutesHandDims.width / 2 + 'px'
    minutesHand.style.height = (height / 2 - 1.2 * dialHours[11].offsetHeight + offByPivot) + 'px'
    minutesHand.style.transformOrigin = `${minutesHandDims.width / 2}px ${minutesHand.offsetHeight - offByPivot}px`
    let secondsHandDims = getDims(minutesHand, false, false)
    secondsHand.style.top = dialHours[11].offsetHeight + 'px'
    secondsHand.style.left = width / 2 - secondsHandDims.width / 2 + 'px'
    secondsHand.style.height = (height / 2 - dialHours[11].offsetHeight + offByPivot) + 'px'
    secondsHand.style.transformOrigin = `${secondsHandDims.width / 2}px ${secondsHand.offsetHeight - offByPivot}px`
    let dt = new Date();
    // let secsElpased = dt.getSeconds()
    // let minsElapsed = dt.getMinutes() + secsElpased / 60
    // let hrsElapsed = dt.getHours() % 12 + minsElapsed / 60
    document.getElementById(`clock-${type}-status`).innerHTML = dt.toLocaleString('en-US', { timeZone: worldTimes[type].timezone }).match(/[a-z]+/gi).toString();
    _localTime = dt.toLocaleString('en-US', { timeZone: worldTimes[type].timezone }).split(',')[1].replace(/\s[a-z]+/gi, '').split(':');
    let secsElpased = _localTime[2];
    let minsElapsed = _localTime[1];
    let hrsElapsed = _localTime[0];
    console.log(`${hrsElapsed}-${minsElapsed}-${secsElpased}`)
    let rotate = (elm, deg) => { elm.style.transform = `rotate(${deg}deg)` }

    showTime(type, rotate, {
        hrsElapsed: hrsElapsed,
        minsElapsed: minsElapsed,
        secsElpased: secsElpased
    }, {
        hoursHand: hoursHand,
        minutesHand: minutesHand,
        secondsHand: secondsHand
    });
}

function showTime(type, fun, tConfig, hConfig) {
    document.getElementById(`clock-${type}-text`).innerHTML = worldTimes[type].text;
    let hrsRotn = tConfig.hrsElapsed * 360 / 12;
    let minsRotn = tConfig.minsElapsed * 360 / 60;
    let secsRotn = tConfig.secsElpased * 360 / 60;
    fun(hConfig.hoursHand, hrsRotn);
    fun(hConfig.minutesHand, minsRotn);
    fun(hConfig.secondsHand, secsRotn);
    setTimeout(() => (hConfig.secondsHand.style.transition = 'transform 1s linear'), 0);
    setInterval(() => {
        hrsRotn += 360 / (3600 * 12);
        minsRotn += 360 / (60 * 60);
        secsRotn += 360 / 60;
        fun(hConfig.hoursHand, hrsRotn);
        fun(hConfig.minutesHand, minsRotn);
        fun(hConfig.secondsHand, secsRotn);
    }, 1000)
}

init('tokyo');