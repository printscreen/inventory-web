<?php 
class Inventory_Utils_Request
{
    public static function isModuleRequested($moduleName)
    {
        $requestUri = $_SERVER['REQUEST_URI'];
        if ($requestUri[0] == '/') {
            $requestUri = substr($requestUri, 1);
        }
        $requestedModule = strtolower(current(explode('/', $requestUri, 2)));
        if ($requestedModule == $moduleName) {
            return true;
        }
        $requestedModule = current(explode('?', $requestUri, 2));
        if (($requestedModule == $moduleName) || ($requestedModule == $moduleName . '/')) {
            return true;
        }
        return false;
    }

    public static function isIE6()
    {
        if(self::getBrowser() == 'Internet Explorer 6') {
            return true;
        } else {
            return false;
        }
    }

    public static function isIE7()
    {
        if(self::getBrowser() == 'Internet Explorer 7') {
            return true;
        } else {
            return false;
        }
    }

    public static function isIE8()
    {
        if(self::getBrowser() == 'Internet Explorer 8') {
            return true;
        } else {
            return false;
        }
    }

    
    /**
     * Detects browser and version based on $_SERVER['HTTP_USER_AGENT]. Browsers: Firefox, IE, Chromium, and Safari.  Otherwise returns false.
     * References:  https://developer.mozilla.org/en/Gecko_user_agent_string_reference
     *              http://www.useragentstring.com/pages/useragentstring.php
     * @return array|bool  Returns array with browser and major version number if can get browser, otherwise false.
     */
    public static function getBrowser()
    {
        /* Examples in the useragent string:
         * IE:   MSIE 9.0
         * Firefox:  Firefox/5.0
         * Chrome:  Chrome/10.0  Chromium/10.0
         * Safari:  Version/5.1
         */
        $userAgent = $_SERVER['HTTP_USER_AGENT'];

        // get browser first then set version regex.
        $regexBrowser = '/firefox|msie|chrom|safari/i'; // chrome before safari
        preg_match($regexBrowser, $userAgent, $matches);

        if(!is_array($matches) || empty($matches)) {
            return false;
        }
        
        switch (strtolower($matches[0])) {
            case 'firefox':
                $browserName = 'Mozilla Firefox';
                $versionRegex = '/(firefox)\/(\d+((\.\d)+)?)/i';
                break;
            case 'msie':
                $browserName = 'Internet Explorer';
                $versionRegex = '/(msie)\s+(\d+((\.\d)+)?)/i';
                break;
            case 'chrom':
                $browserName = 'Google Chromium';
                $versionRegex = '/(chrome|chromium)\/(\d+((\.\d)+)?)/i';
                break;
            case 'safari':
                $browserName = 'Apple Safari';
                $versionRegex = '/(Version)\/(\d+((\.\d)+)?)/i';
                continue;
            default:
                return false;
        }

        // get version
        $matches = null;
        preg_match($versionRegex, $userAgent, $matches);

        // full version
        $browserVersion = $matches[2];

        // return just the major version number
        $browserVersion = floor($browserVersion);

        return $browserName . ' ' . $browserVersion;
    }

    /**
     * Detects if Mac.
     * @return bool
     */
    public static function isMac()
    {
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        return is_int(strpos($userAgent, 'Macintosh'));
    }

    /**
     * Detects if Windows.
     * @return bool
     */
    public static function isWin()
    {
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        return is_int(strpos($userAgent, 'Windows'));
    }

    /**
     * Detects Windows and Mac operating systems & versions based on $_SERVER['HTTP_USER_AGENT'].
     * Valid for:  Windows 98 to Windows 7.  Mac OS 10.4 to Mac OS 10.7.
     * Reference:  https://developer.mozilla.org/en/Gecko_user_agent_string_reference
     * @return bool|string  The OS & version or false if not Windows or Mac.
     */
    public static function getOs()
    {
        $userAgent = $_SERVER['HTTP_USER_AGENT'];

        // displaystring => useragentstring
        $versions = array(
            'Windows 7' => 'Windows NT 6.1',
            'Windows XP' => 'Windows NT 5.1',
            'Windows Vista' => 'Windows NT 6.0',
            'Windows 2000' => 'Windows NT 5.0',
            'Windows 98' => 'Win98',
            'Mac OS 10.4 (Tiger)' => 'Mac OS X 10_4',
            'Mac OS 10.5 (Leopard)' => 'Mac OS X 10_5',
            'Mac OS 10.6 (Snow Leopard)' => 'Mac OS X 10_6',
            'Mac OS 10.7 (Lion)' => 'Mac OS X 10_7'
        );
        foreach ($versions as $displayText => $userAgentString) {
            if (is_int(strpos($userAgent, $userAgentString))) {
                return $displayText;
            }
        }
        return false;
    }
}