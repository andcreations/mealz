import * as React from 'react';
import classNames from 'classnames';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { INGREDIENT_LANGUAGE } from '../../../common';
import { useTranslations } from '../../../i18n';
import { getCaloriesPer100 } from '../../../ingredients';
import {
  IngredientsDropdownTranslations,
} from './IngredientsDropdown.translations';

export interface IngredientsDropdownProps {
  ingredients: GWIngredient[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function IngredientsDropdown(props: IngredientsDropdownProps) {
  const translate = useTranslations(IngredientsDropdownTranslations);

  const renderIngredient = (ingredient: GWIngredient, index: number) => {
    const selected = index === props.selectedIndex;
    const ingredientClassNames = classNames(
      'mealz-ingredients-dropdown-entry',
      'mealz-ingredients-dropdown-ingredient',
      { 'mealz-ingredients-dropdown-entry-selected': selected },
    );
    const calories = getCaloriesPer100(ingredient);
    return (
      <div 
        key={ingredient.id}
        className={ingredientClassNames}
        onClick={() => props.onSelect(index)}
      >
        <div className='mealz-ingredients-dropdown-ingredient-name'>
          {ingredient.name[INGREDIENT_LANGUAGE]}
        </div>
        <div className='mealz-ingredients-dropdown-ingredient-separator'>
          ·
        </div>
        <div className='mealz-ingredients-dropdown-ingredient-calories'>
          {calories ? `${calories.toFixed(0)} kcal` : ''}
        </div>
      </div>
    );
  };

  const renderIngredients = () => {
    if (props.ingredients.length === 0) {
      return (
        <div className='
          mealz-ingredients-dropdown-entry
          mealz-ingredients-dropdown-no-results'
        >
          {translate('no-results')}
        </div>
      );
    }

    return props.ingredients.map((ingredient, index) => {
      return renderIngredient(ingredient, index);
    });
  };

  return (
    <div className='mealz-ingredients-dropdown'>
      {renderIngredients()}
    </div>
  );
}