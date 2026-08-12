export interface CropField {
  id: string;
  name: string;
  cropType: string;
  areaAcres: number;
  plantingDate: string;
  expectedHarvestDate: string;
  stage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Ripening' | 'Harvest Ready';
  progressPercentage: number;
  soilMoisture: number; // 0 to 100%
  soilHealth: 'Optimal' | 'Requires Attention' | 'Good';
  lastWatered: string;
  lastFertilized: string;
  notes: string;
  color: string;
  status: 'healthy' | 'warning' | 'critical';
}

export interface FarmTask {
  id: string;
  title: string;
  fieldId: string;
  fieldName: string;
  type: 'irrigation' | 'fertilizer' | 'pest_control' | 'harvest' | 'soil_testing' | 'general';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  soilMoistureAvg: number;
  uvIndex: number;
  location: string;
}

export interface HarvestRecord {
  id: string;
  fieldName: string;
  cropType: string;
  yieldKg: number;
  date: string;
  revenueEst: number;
  qualityGrade: 'A+' | 'A' | 'B';
}

export const INITIAL_WEATHER: WeatherData = {
  temperature: 26,
  condition: 'Partly Cloudy',
  humidity: 62,
  rainChance: 25,
  windSpeed: 12,
  soilMoistureAvg: 68,
  uvIndex: 6,
  location: 'Valley Green Farm, Plot 4',
};

export const INITIAL_FIELDS: CropField[] = [
  {
    id: 'field-1',
    name: 'North Sector A',
    cropType: 'Organic Sweet Corn',
    areaAcres: 4.5,
    plantingDate: '2026-05-10',
    expectedHarvestDate: '2026-08-25',
    stage: 'Ripening',
    progressPercentage: 85,
    soilMoisture: 65,
    soilHealth: 'Optimal',
    lastWatered: 'Yesterday at 07:00 AM',
    lastFertilized: '2026-07-20',
    notes: 'Nitrogen levels good. Expecting high yield.',
    color: '#EAB308',
    status: 'healthy',
  },
  {
    id: 'field-2',
    name: 'East Greenhouse B',
    cropType: 'Roma Tomatoes',
    areaAcres: 2.0,
    plantingDate: '2026-06-01',
    expectedHarvestDate: '2026-09-10',
    stage: 'Flowering',
    progressPercentage: 60,
    soilMoisture: 42,
    soilHealth: 'Requires Attention',
    lastWatered: '2 days ago',
    lastFertilized: '2026-07-28',
    notes: 'Moisture slightly low. Schedule drip irrigation.',
    color: '#EF4444',
    status: 'warning',
  },
  {
    id: 'field-3',
    name: 'South Field C',
    cropType: 'Golden Soybeans',
    areaAcres: 8.0,
    plantingDate: '2026-04-15',
    expectedHarvestDate: '2026-08-10',
    stage: 'Harvest Ready',
    progressPercentage: 98,
    soilMoisture: 72,
    soilHealth: 'Optimal',
    lastWatered: '3 days ago',
    lastFertilized: '2026-07-01',
    notes: 'Pods fully mature. Ideal dry window next 3 days.',
    color: '#16A34A',
    status: 'healthy',
  },
  {
    id: 'field-4',
    name: 'West Plot D',
    cropType: 'Winter Wheat',
    areaAcres: 6.2,
    plantingDate: '2026-07-01',
    expectedHarvestDate: '2026-11-05',
    stage: 'Seedling',
    progressPercentage: 25,
    soilMoisture: 78,
    soilHealth: 'Good',
    lastWatered: 'Today at 06:00 AM',
    lastFertilized: '2026-07-15',
    notes: 'Germination rate 94%. Growth is uniform.',
    color: '#0284C7',
    status: 'healthy',
  },
];

export const INITIAL_TASKS: FarmTask[] = [
  {
    id: 'task-1',
    title: 'Run drip irrigation system',
    fieldId: 'field-2',
    fieldName: 'East Greenhouse B',
    type: 'irrigation',
    dueDate: 'Today, 4:00 PM',
    priority: 'high',
    completed: false,
    notes: 'Apply 350L water cycle for tomatoes',
  },
  {
    id: 'task-2',
    title: 'Soil pH & Nitrogen test',
    fieldId: 'field-4',
    fieldName: 'West Plot D',
    type: 'soil_testing',
    dueDate: 'Tomorrow',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Prepare combine harvester',
    fieldId: 'field-3',
    fieldName: 'South Field C',
    type: 'harvest',
    dueDate: 'Aug 8',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Apply organic bio-fungicide',
    fieldId: 'field-1',
    fieldName: 'North Sector A',
    type: 'pest_control',
    dueDate: 'Aug 10',
    priority: 'low',
    completed: true,
  },
];

export const INITIAL_HARVESTS: HarvestRecord[] = [
  {
    id: 'harv-1',
    fieldName: 'West Valley Plot',
    cropType: 'Alfalfa Hay',
    yieldKg: 3400,
    date: '2026-07-28',
    revenueEst: 2850,
    qualityGrade: 'A+',
  },
  {
    id: 'harv-2',
    fieldName: 'East Greenhouse A',
    cropType: 'Bell Peppers',
    yieldKg: 1200,
    date: '2026-07-15',
    revenueEst: 3900,
    qualityGrade: 'A',
  },
  {
    id: 'harv-3',
    fieldName: 'South Plot B',
    cropType: 'Sweet Barley',
    yieldKg: 5100,
    date: '2026-06-30',
    revenueEst: 4200,
    qualityGrade: 'A',
  },
];
