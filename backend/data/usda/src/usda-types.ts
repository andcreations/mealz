export interface Food {
  fdc_id: string;
  data_type: string;
  description: string;
  food_category_id: string;
  publication_date: string;
}

export interface Nutrient {
  id: string;
  name: string;
  unit_name: string;
  nutrient_nbr: string;
  rank: string;
}

export interface FoodNutrient {
  id: string;
  fdc_id: string;
  nutrient_id: string;
  amount: string;
  data_points: string;
  derivation_id: string;
  min: string;
  max: string;
  median: string;
  footnote: string;
  min_year_acquired: string;
}

export interface USDAData {
  foods: Food[];
  nutrients: Nutrient[];
  foodNutrients: FoodNutrient[];
}