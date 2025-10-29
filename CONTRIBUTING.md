# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à cette application! Ce guide explique comment participer.

## Code de Conduite

Soyez respectueux et bienveillant envers les autres contributeurs. Tout harassment ou comportement inapproprié sera sanctionné.

## Comment Contribuer

### 1. Signaler un Bug

**Avant de signaler:**
- Vérifier que le bug n'a pas déjà été signalé
- Reproduire le bug de manière consistente
- Collecter les informations pertinentes

**Ouvrir une issue:**
```
Titre: [BUG] Courte description

Description:
1. Étapes pour reproduire
2. Comportement attendu
3. Comportement actuel
4. Screenshots si pertinent
5. Environnement (OS, navigateur, version)
```

### 2. Suggérer une Amélioration

```
Titre: [FEATURE] Description courte

Description:
1. Motivation: Pourquoi cette feature?
2. Solution proposée
3. Alternatives considérées
4. Exemple d'utilisation
```

### 3. Soumettre du Code

**Processus:**

1. **Fork le repository**
```bash
# Sur GitHub, cliquer "Fork"
```

2. **Cloner votre fork**
```bash
git clone https://github.com/YOUR_USERNAME/gestion-stocks.git
cd gestion-stocks
```

3. **Créer une branche**
```bash
git checkout -b feature/nom-feature
# Ou pour un bug:
git checkout -b fix/description-bug
```

4. **Effectuer les changements**
- Suivre les conventions de code
- Ajouter des tests si applicable
- Mettre à jour la documentation

5. **Vérifier le code**
```bash
# Formater
pnpm format.fix

# Tester
pnpm test

# Vérifier les types
pnpm typecheck

# Build
pnpm build
```

6. **Commiter les changements**
```bash
git add .
git commit -m "feat: description courte et claire"
```

Respecter le format [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nouvelle feature
- `fix:` Correction de bug
- `docs:` Changements de documentation
- `style:` Changements de style (non-fonctionnels)
- `refactor:` Refactorisation de code
- `perf:` Amélioration de performance
- `test:` Ajout/modification de tests

7. **Pusher vers votre fork**
```bash
git push origin feature/nom-feature
```

8. **Ouvrir une Pull Request**
- Aller sur GitHub
- Cliquer "Compare & pull request"
- Remplir la description

**Template de PR:**
```markdown
## Description
Courte description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change
- [ ] Documentation

## Changements
- Point 1
- Point 2
- Point 3

## Tests
- [ ] Test 1
- [ ] Test 2

## Checklist
- [ ] Code suit les conventions
- [ ] Documentation mise à jour
- [ ] Tests ajoutés
- [ ] Pas d'erreurs build
```

## Conventions de Code

### JavaScript/TypeScript

```typescript
// Imports organisés
import React, { useState } from 'react';
import { useStock } from '@/lib/context';

// Types en premier
interface Props {
  title: string;
  onClick: () => void;
}

// Composant
export default function MyComponent(props: Props) {
  const [state, setState] = useState('');

  const handleClick = () => {
    setState('new value');
  };

  return <div onClick={handleClick}>{state}</div>;
}
```

**Règles:**
- ✅ 2 espaces d'indentation
- ✅ Utiliser `const` par défaut
- ✅ Nommer les variables clairement
- ✅ Commenter le code complexe
- ✅ Pas de `console.log()` en production

### React

```typescript
// ✅ Bon
const [isOpen, setIsOpen] = useState(false);

// ❌ Mauvais
const [open, setOpen] = useState(false);

// ✅ Bon - Fonction avant JSX
const handleSubmit = () => {
  // ...
};

// ❌ Mauvais - Fonction en JSX
<button onClick={() => {
  // ...
}}>
```

### Tailwind CSS

```jsx
// ✅ Bon - Classes claires
<div className="bg-blue-600 text-white px-4 py-2 rounded-lg">

// ❌ Mauvais - Mélange de styles
<div style={{ background: 'blue' }} className="text-white">

// ✅ Bon - Classes conditionnelles
const bgClass = isActive ? 'bg-blue-600' : 'bg-gray-100';
<div className={cn('px-4 py-2', bgClass)}>
```

## Structure des Fichiers

```
// ✅ Bon
client/
├── pages/
│   └── NewPage.tsx
├── components/
│   ├── NewComponent.tsx
│   └── index.ts
└── lib/
    └── newUtility.ts

// ❌ Mauvais - Tout au même endroit
client/
└── pages/
    ├── NewPage.tsx
    ├── NewComponent.tsx
    └── NewUtility.ts
```

## Tests

```typescript
// Exemple de test
import { describe, it, expect } from 'vitest';
import { calculateStock } from '@/lib/db';

describe('calculateStock', () => {
  it('should return 0 for new product', () => {
    const result = calculateStock('prod_001', []);
    expect(result).toBe(0);
  });

  it('should sum entries and subtract exits', () => {
    const movements = [
      { type_mouvement: 'ENTREE', quantite: 10 },
      { type_mouvement: 'SORTIE', quantite: 3 },
    ];
    const result = calculateStock('prod_001', movements);
    expect(result).toBe(7);
  });
});
```

## Documentation

### Fichiers à Documenter

1. **Fonctions complexes**
```typescript
/**
 * Calcule le stock actuel d'un produit
 * @param productId - ID du produit
 * @param movements - Liste de tous les mouvements
 * @returns Stock actuel en quantité
 */
function calculateProductStock(
  productId: string,
  movements: Movement[]
): number {
  // ...
}
```

2. **Composants réutilisables**
```typescript
/**
 * Bouton d'action réutilisable
 * @component
 * @example
 * const handleClick = () => console.log('Clicked');
 * return <ActionButton label="Click me" onClick={handleClick} />
 */
export function ActionButton(props: Props) {
  // ...
}
```

3. **README/CHANGELOG**
- Mettre à jour si changements importants
- Expliquer les nouvelles fonctionnalités

## Process de Review

1. **Vérification automatique**
   - Tests passent
   - Pas d'erreurs TypeScript
   - Build réussit

2. **Review du code**
   - Respecte les conventions
   - Logique claire
   - Performance acceptable
   - Documentation présente

3. **Approbation et Merge**
   - Au moins une approbation
   - Tous les commentaires résolus
   - Branche à jour avec main

## Reporting de Sécurité

**NE PAS** ouvrir une issue publique pour les problèmes de sécurité!

Contacter directement:
- Email: security@example.com
- Fournir les détails de la vulnérabilité
- Laisser le temps pour corriger avant disclosure

## Questions?

- 💬 Ouvrir une discussion
- 📧 Contacter les mainteneurs
- 📚 Consulter la documentation

## Merci! 🎉

Chaque contribution, grande ou petite, est appréciée!
