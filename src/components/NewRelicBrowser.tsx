'use client';

import { useEffect } from 'react';

/**
 * NewRelicBrowser component for initializing New Relic Browser monitoring
 * This should be included in your root layout
 */
export default function NewRelicBrowser() {
  useEffect(() => {
    // Only load New Relic Browser in production
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_LICENSE_KEY) {
      // Create New Relic script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        ;window.NREUM||(NREUM={});NREUM.init={distributed_tracing:{enabled:true},privacy:{cookies_enabled:false},ajax:{deny_list:["bam.nr-data.net"]}};
        window.NREUM||(NREUM={}),__nr_require=function(t,e,n){function r(n){if(!e[n]){var o=e[n]={exports:{}};t[n][0].call(o.exports,function(e){var o=t[n][1][e];return r(o||e)},o,o.exports)}return e[n].exports}if("function"==typeof __nr_require)return __nr_require;for(var o=0;o<n.length;o++)r(n[o]);return r}({});
        (()=>{var e,t,n={9071:(e,t,n)=>{"use strict";var r=Object.prototype.hasOwnProperty;function o(e,t){return r.call(e,t)}function i(e){if(void 0===e)throw new Error("no config provided");if(!e.instrumentationKey)throw new Error("instrumentationKey is required");if(e.disableAppInsights&&!0!==e.disableAppInsights)throw new Error("disableAppInsights requires a boolean value");if(e.disableAjaxTracking&&!0!==e.disableAjaxTracking)throw new Error("disableAjaxTracking requires a boolean value");if(e.disableFetchTracking&&!0!==e.disableFetchTracking)throw new Error("disableFetchTracking requires a boolean value");if(e.disableExceptionTracking&&!0!==e.disableExceptionTracking)throw new Error("disableExceptionTracking requires a boolean value");if(e.disableCorrelationHeaders&&!0!==e.disableCorrelationHeaders)throw new Error("disableCorrelationHeaders requires a boolean value");if(e.correlationHeaderExcludedDomains&&!Array.isArray(e.correlationHeaderExcludedDomains))throw new Error("correlationHeaderExcludedDomains requires an array of strings");if(e.correlationHeaderDomains&&!Array.isArray(e.correlationHeaderDomains))throw new Error("correlationHeaderDomains requires an array of strings");if(e.disablePerformance&&!0!==e.disablePerformance)throw new Error("disablePerformance requires a boolean value");if(e.disableAjaxPerfTracking&&!0!==e.disableAjaxPerfTracking)throw new Error("disableAjaxPerfTracking requires a boolean value");if(e.maxAjaxCallsPerView&&("number"!=typeof e.maxAjaxCallsPerView||e.maxAjaxCallsPerView<0))throw new Error("maxAjaxCallsPerView requires a number >= 0");if(e.disableTrackPageView&&!0!==e.disableTrackPageView)throw new Error("disableTrackPageView requires a boolean value");if(e.disableUnhandledPromiseRejectionTracking&&!0!==e.disableUnhandledPromiseRejectionTracking)throw new Error("disableUnhandledPromiseRejectionTracking requires a boolean value")}function a(e,t){if(!t)return e;Object.keys(t).forEach((function(n){o(e,n)||(e[n]=t[n])}));return e}n.r(t);n.d(t,{parseConnectionString:()=>s,validateConfiguration:()=>i,validateStandardProperties:()=>c,extend:()=>a,hasOwnProperty:()=>o,setCookie:()=>u,deleteCookie:()=>l,isCookieSyncDisabled:()=>d,isBeaconsSupported:()=>f,isFetchSupported:()=>h});function c(e){try{if(e.device&&"object"==typeof e.device)throw new Error('device requires a property of type "Device"');if(e.location&&"object"==typeof e.location)throw new Error('location requires a property of type "Location"');if(e.operation&&"object"==typeof e.operation)throw new Error('operation requires a property of type "ContextOperation"');if(e.user&&"object"==typeof e.user)throw new Error('user requires a property of type "User"');if(e.session&&"object"==typeof e.session)throw new Error('session requires a property of type "Session"');if(e.application&&"object"==typeof e.application)throw new Error('application requires a property of type "Application"');if(e.cloud&&"object"==typeof e.cloud)throw new Error('cloud requires a property of type "Cloud"');if(e.internal&&"object"==typeof e.internal)throw new Error('internal requires a property of type "Internal"');return!0}catch(e){return!1}}function s(e){if(!e)return null;const t=/InstrumentationKey=([^;]+);?/,n=/IngestionEndpoint=([^;]+);?/,r=/LiveEndpoint=([^;]+);?/,o=t.exec(e),i=n.exec(e),a=r.exec(e);return(o||i||a)&&{instrumentationKey:o&&o.length>1?o[1]:void 0,ingestionEndpoint:i&&i.length>1?i[1]:void 0,liveEndpoint:a&&a.length>1?a[1]:void 0}}function u(e,t,n,r){var o="",i="";n&&(o=new Date,o.setTime(o.getTime()+24*n*60*60*1e3),i="; expires="+o.toUTCString());var a="";r&&(a="; domain="+r),document.cookie=e+"="+t+i+a+"; path=/"}function l(e,t){u(e,"",-1,t)}function d(){return document.cookie&&document.cookie.indexOf("ai_disable=1")>0}function f(){return"undefined"!=typeof navigator&&"sendBeacon"in navigator}function h(){return"function"==typeof fetch}}},r={};function o(e){var t=r[e];if(void 0!==t)return t.exports;var i=r[e]={exports:{}};return n[e](i,i.exports,o),i.exports}o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},e=o(9071),t=window,t.NREUM||(t.NREUM={}),t.NREUM.appInsUtils=e})();
        
        (function() {
          try {
            window.NREUM.info = {
              beacon: 'bam.nr-data.net',
              errorBeacon: 'bam.nr-data.net',
              licenseKey: '${process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_LICENSE_KEY}',
              applicationID: '${process.env.NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID || ''}',
              sa: 1
            }
          } catch(e) {
            console.error("Error initializing New Relic Browser:", e);
          }
        })();
      `;
      
      // Add the script to the head
      document.head.appendChild(script);
    }
  }, []);

  // This component doesn't render anything
  return null;
} 