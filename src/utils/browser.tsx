const browserUtils = {
    isIOs: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: () => /android|Android/i.test(navigator.userAgent),
    isIPad: () => {
        if (/iPad/i.test(navigator.userAgent)) {
            return true;
        }
        if (/Macintosh/i.test(navigator.userAgent)) {
            try {
                document.createEvent('TouchEvent');
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    },
    isIPhone: () => /iphone/i.test(navigator.userAgent),
    isPc: () => {
        const userAgentInfo = navigator.userAgent;
        const Agents = ['Android', 'iPhone',
            'SymbianOS', 'Windows Phone',
            'iPad', 'iPod'];
        let flag = true;
        for (const v of Agents) {
            if (userAgentInfo.indexOf(v) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    isMobile: () => {
        const userAgentInfo = navigator.userAgent;
        const Agents = ['Android', 'iPhone',
            'SymbianOS', 'Windows Phone',
            'iPad', 'iPod'];
        let flag = false;
        for (const v of Agents) {
            if (userAgentInfo.indexOf(v) > 0) {
                flag = true;
                break;
            }
        }
        return flag;
    }
};

export default browserUtils;
