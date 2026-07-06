// lib/mock-data.js

export const MOCK_DATES = {
  NOW: "2026-06-13T13:00:00Z",
  FIVE_MIN_AGO: "2026-06-13T12:55:00Z",
  EIGHT_MIN_AGO: "2026-06-13T12:52:00Z",
  TWELVE_MIN_AGO: "2026-06-13T12:48:00Z",
  FIFTEEN_MIN_AGO: "2026-06-13T12:45:00Z",
  TWENTY_FIVE_MIN_AGO: "2026-06-13T12:35:00Z",
  THIRTY_MIN_AGO: "2026-06-13T12:30:00Z",
  FORTY_FIVE_MIN_AGO: "2026-06-13T12:15:00Z",
  ONE_HOUR_AGO: "2026-06-13T12:00:00Z",
  THREE_HOURS_AGO: "2026-06-13T10:00:00Z",
  SIX_HOURS_AGO: "2026-06-13T07:00:00Z",
  TWELVE_HOURS_AGO: "2026-06-13T01:00:00Z",
  ONE_DAY_AGO: "2026-06-12T13:00:00Z",
  SEVEN_DAYS_AGO: "2026-06-06T13:00:00Z",
  FOURTEEN_DAYS_AGO: "2026-05-30T13:00:00Z",
  TWENTY_EIGHT_DAYS_AGO: "2026-05-16T13:00:00Z",
  THIRTY_DAYS_AGO: "2026-05-14T13:00:00Z",
};

// Mock data for the surveillance dashboard

export const cameras = [
  {
    id: 1,
    name: "Front Door",
    location: "Entrance",
    status: "online",
    recording: true,
    motionDetected: true,
    aiEnabled: true,
    streamUrl: "rtsp://192.168.1.101:554/stream1",
    detections: [
      { type: "person", label: "John Doe", confidence: 0.95, bbox: { x: 120, y: 80, w: 100, h: 200 } },
    ]
  }
];

export const recentAlerts = [
  {
    id: 1,
    type: "unknown_person",
    message: "Unknown person detected",
    camera: "Front Door",
    timestamp: MOCK_DATES.FIVE_MIN_AGO,
    severity: "high",
  },
  {
    id: 2,
    type: "motion",
    message: "Motion detected",
    camera: "Garage",
    timestamp: MOCK_DATES.TWELVE_MIN_AGO,
    severity: "medium",
  },
  {
    id: 3,
    type: "face_recognized",
    message: "John Doe recognized",
    camera: "Front Door",
    timestamp: MOCK_DATES.TWENTY_FIVE_MIN_AGO,
    severity: "low",
  },
  {
    id: 4,
    type: "camera_offline",
    message: "Camera disconnected",
    camera: "Living Room",
    timestamp: MOCK_DATES.FORTY_FIVE_MIN_AGO,
    severity: "high",
  },
  {
    id: 5,
    type: "motion",
    message: "Motion detected",
    camera: "Backyard",
    timestamp: MOCK_DATES.ONE_HOUR_AGO,
    severity: "low",
  },
];

export const eventLogs = [
  {
    id: 1,
    timestamp: MOCK_DATES.FIVE_MIN_AGO,
    camera: "Front Door",
    eventType: "Face Recognized",
    details: "John Doe identified with 95% confidence",
  },
  {
    id: 2,
    timestamp: MOCK_DATES.EIGHT_MIN_AGO,
    camera: "Garage",
    eventType: "Motion Detected",
    details: "Movement in zone A",
  },
  {
    id: 3,
    timestamp: MOCK_DATES.FIFTEEN_MIN_AGO,
    camera: "Front Door",
    eventType: "Unknown Person",
    details: "Unrecognized face detected",
  },
  {
    id: 4,
    timestamp: MOCK_DATES.THIRTY_MIN_AGO,
    camera: "Backyard",
    eventType: "Recording Started",
    details: "Motion-triggered recording",
  },
  {
    id: 5,
    timestamp: MOCK_DATES.FORTY_FIVE_MIN_AGO,
    camera: "Living Room",
    eventType: "Camera Offline",
    details: "Connection lost",
  },
  {
    id: 6,
    timestamp: MOCK_DATES.ONE_HOUR_AGO,
    camera: "Front Door",
    eventType: "SMS Alert Sent",
    details: "Alert sent to +1 (555) 123-4567",
  },
];

export const enrolledFaces = [
  {
    id: 1,
    name: "John Doe",
    role: "Family",
    enrolledAt: MOCK_DATES.THIRTY_DAYS_AGO,
    imageUrl: null,
  },
  {
    id: 2,
    name: "Jane Doe",
    role: "Family",
    enrolledAt: MOCK_DATES.TWENTY_EIGHT_DAYS_AGO,
    imageUrl: null,
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Friend",
    enrolledAt: MOCK_DATES.FOURTEEN_DAYS_AGO,
    imageUrl: null,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    role: "Housekeeper",
    enrolledAt: MOCK_DATES.SEVEN_DAYS_AGO,
    imageUrl: null,
  },
];

export const recordings = [
  {
    id: 1,
    camera: "Front Door",
    timestamp: MOCK_DATES.ONE_HOUR_AGO,
    duration: "00:02:34",
    trigger: "Motion",
    size: "45.2 MB",
    thumbnailUrl: null,
  },
  {
    id: 2,
    camera: "Garage",
    timestamp: MOCK_DATES.THREE_HOURS_AGO,
    duration: "00:01:15",
    trigger: "Face Detected",
    size: "22.8 MB",
    thumbnailUrl: null,
  },
  {
    id: 3,
    camera: "Backyard",
    timestamp: MOCK_DATES.SIX_HOURS_AGO,
    duration: "00:03:45",
    trigger: "Motion",
    size: "67.1 MB",
    thumbnailUrl: null,
  },
  {
    id: 4,
    camera: "Front Door",
    timestamp: MOCK_DATES.TWELVE_HOURS_AGO,
    duration: "00:00:58",
    trigger: "Unknown Person",
    size: "18.4 MB",
    thumbnailUrl: null,
  },
  {
    id: 5,
    camera: "Garage",
    timestamp: MOCK_DATES.ONE_DAY_AGO,
    duration: "00:04:12",
    trigger: "Motion",
    size: "78.9 MB",
    thumbnailUrl: null,
  },
];

export const systemSettings = {
  alertsEnabled: true,
  smsNotifications: true,
  motionSensitivity: 75,
  remoteAccessEnabled: true,
  autoRecordOnMotion: true,
  retentionDays: 30,
  emailNotifications: false,
  pushNotifications: true,
};

export const systemStats = {
  totalCameras: 4,
  onlineCameras: 3,
  totalRecordings: 156,
  storageUsed: "45.2 GB",
  storageTotal: "500 GB",
  alertsToday: 12,
  facesEnrolled: 4,
  uptime: "15d 8h 23m",
};
