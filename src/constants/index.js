// enable/disable different features by changing this configuration file
export const initSDKConfig = {
    disableAudioLevels: false,
     audioLevelsInterval: 200,
    // useIPv6 - boolean property
     disableSimulcast: false,
     //enableWindowOnErrorHandler : true,
    // disableThirdPartyRequests - if true - callstats will be disabled and the callstats API won't be included.
     enableAnalyticsLogging : true,
    // externalStorage - Object that implements the Storage interface. If specified this object will be used for storing data instead of localStorage.
    // callStatsCustomScriptUrl - (optional) custom url to access callstats client script
    // disableRtx - (optional) boolean property (default to false). Enables/disable the use of RTX.
    // disabledCodec - the mime type of the code that should not be negotiated on the peerconnection.
    // preferredCodec the mime type of the codec that needs to be made the preferred codec for the connection. 
    // Enables calendar integration, depends on googleApiApplicationClientID
    // and microsoftApiApplicationClientID
     enableCalendarIntegration: true,
     googleApiApplicationClientID: '879810033171-ooddfse57q12u1ip6ffpvdu1pjqcoba6.apps.googleusercontent.com',
     analytics: {
        // Configuration for the rtcstats server:
        // By enabling rtcstats server every time a conference is joined the rtcstats
        // module connects to the provided rtcstatsEndpoint and sends statistics regarding
        // PeerConnection states along with getStats metrics polled at the specified
        // interval.
        rtcstatsEnabled: true,

        // In order to enable rtcstats one needs to provide a endpoint url.
        rtcstatsEndpoint: 'wss://localhost:8080',

        // The interval at which rtcstats will poll getStats, defaults to 1000ms.
        // If the value is set to 0 getStats won't be polled and the rtcstats client
        // will only send data related to RTCPeerConnection events.
        rtcstatsPolIInterval: 1000,
     }
};

export const connectionConfig = {
    hosts: {
        domain: 'sariska.io',
        muc: 'muc.sariska.io'
    },
    serviceUrl: 'wss://api.sariska.io/api/v1/media/websocket',
    clientNode: 'https://www.sariska.io',
    // enableLipSync - (optional) boolean property which enables the lipsync feature. Currently works only in Chrome and is disabled by default.
};

export const conferenceConfig = {
     openBridgeChannel: 'websocket', //- Enables/disables bridge channel. Values can be "datachannel", "websocket", true (treat it as "datachannel"), undefined (treat it as "datachannel") and false (don't open any channel). NOTE: we recommend to set that option to true
     recordingType : 'stream',
    // callStatsID - callstats credentials
    // callStatsSecret - callstats credentials
    // enableTalkWhileMuted - boolean property. Enables/disables talk while muted detection, by default the value is false/disabled.
    // ignoreStartMuted - ignores start muted events coming from jicofo.
    // startSilent - enables silent mode, will mark audio as inactive will not send/receive audio
    // confID - Used for statistics to identify conference, if tenants are supported will contain tenant and the non lower case variant for the room name.
    // siteID - (optional) Used for statistics to identify the site where the user is coming from, if tenants are supported it will contain a unique identifier for that tenant. If not provided, the value will be infered from confID
    // statisticsId - The id to be used as stats instead of default callStatsUsername.
     statisticsDisplayName: 'Guru',
     //The display name to be used for stats, used for callstats.
     //focusUserJid : 'focus@auth.sariska.io',
     enableNoAudioDetection: true,
     enableNoisyMicDetection: true,
    // enableRemb
    // enableTcc
    // useRoomAsSharedDocumentName
    liveStreamingEnabled: true,
    channelLastN: 4,
    // startBitrate
    // stereo   
    // forceJVB121Ratio - "Math.random() < forceJVB121Ratio" will determine whether a 2 people conference should be moved to the JVB instead of P2P. The decision is made on the responder side, after ICE succeeds on the P2P connection.
    // hiddenDomain
    startAudioOnly: true,
    //startAudioMuted: 1,
    //startVideoMuted: 1,
    startWithVideoMuted: true,
    // enableLayerSuspension - if set to 'true', we will cap the video send bitrate when we are told we have not been selected by any endpoints (and therefore the non-thumbnail streams are not in use).
    // deploymentInfo
    // shard
    // userRegion
    // rttMonitor
    // enabled
    // initialDelay
    // getStatsInterval
    // analyticsInterval
    // stunServers
     e2eping:{
        pingInterval: -1,
     // analyticsInterval: 60000,
     },
    // pingInterval
    // abTesting - A/B testing related options
    // enableSuspendVideoTest
    // testing
    // capScreenshareBitrate
    disableE2E: false,
     p2pTestMode: false,
    // octo
    // probability
    p2p: {
        // Enables peer to peer mode. When enabled the system will try to
        // establish a direct connection when there are exactly 2 participants
        // in the room. If that succeeds the conference will stop sending data
        // through the JVB and use the peer to peer connection instead. When a
        // 3rd participant joins the conference will be moved back to the JVB
        // connection.
        enabled: true,

        // The STUN servers that will be used in the peer to peer connections
        stunServers: [
           { urls: 'stun.l.google.com:19302' }
        ],

        // Sets the ICE transport policy for the p2p connection. At the time
        // of this writing the list of possible values are 'all' and 'relay',
        // but that is subject to change in the future. The enum is defined in
        // the WebRTC standard:
        // https://www.w3.org/TR/webrtc/#rtcicetransportpolicy-enum.
        // If not set, the effective value is 'all'.
        // iceTransportPolicy: 'all',

        // Provides a way to set the video codec preference on the p2p connection. Acceptable
        // codec values are 'VP8', 'VP9' and 'H264'.
        // preferredCodec: 'H264',

        // Provides a way to prevent a video codec from being negotiated on the p2p connection.
        // disabledCodec: '',


        // How long we're going to wait, before going back to P2P after the 3rd
        // participant has left the conference (to filter out page reload).
         backToP2PDelay: 5
    }
};

export const GENERATE_TOKEN_URL = "https://api.sariska.io/api/v1/misc/generate-token";


