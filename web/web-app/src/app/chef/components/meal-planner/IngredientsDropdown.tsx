import * as React from 'react';
import classNames from 'classnames';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { INGREDIENT_LANGUAGE } from '../../../common';
import { useTranslations } from '../../../i18n';
import { getCaloriesPer100 } from '../../../ingredients';
import { useService } from '../../../hooks';
import { SettingsService } from '../../../settings';
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
  const settings = useService(SettingsService);

  const buildName = (ingredient: GWIngredient) => {
    let name = `${ingredient.name[INGREDIENT_LANGUAGE]}`;
    const secondaryLanguage = settings.getIngredientsSecondaryLanguage();
    if (secondaryLanguage && settings.showSecondaryLanguage()) {
      const secondaryName = secondaryLanguage
        ? ingredient.name[secondaryLanguage]
        : undefined;
      if (secondaryName) {
        name += ` · ${secondaryName}`;
      }
    }
    return name;
  }

  const renderIngredient = (ingredient: GWIngredient, index: number) => {
    const selected = index === props.selectedIndex;
    const ingredientClassNames = classNames(
      'mealz-ingredients-dropdown-entry',
      'mealz-ingredients-dropdown-ingredient',
      { 'mealz-ingredients-dropdown-entry-selected': selected },
    );

    const name = buildName(ingredient);
    const calories = getCaloriesPer100(ingredient);

    return (
      <div 
        key={ingredient.id}
        className={ingredientClassNames}
        onClick={() => props.onSelect(index)}
      >
        <div className='mealz-ingredients-dropdown-ingredient-name'>
          { name }
        </div>
        <div className='mealz-ingredients-dropdown-ingredient-separator'>
          ·
        </div>
        <div className='mealz-ingredients-dropdown-ingredient-calories'>
          { calories ? `${calories.toFixed(0)} kcal` : '' }
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