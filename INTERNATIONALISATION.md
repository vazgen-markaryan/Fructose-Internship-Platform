# Guide de Configuration pour l'Internationalisation (i18n)

## Étape 1: 
- Installez les dépendances suivantes sur votre ordi pour i18n:

```bash
npm install react-i18next i18next --save
```

## Étape 2:
- Tout de suite après dans frontend/fructose/src/ run:
```bash 
npm install
```

## Étape 3:
- Ensuite, pour utiliser traduction dans vos composants il faut importer i18n et  ajouter un HOOK
- Utilisez OBLIGATOIREMENT const {t}
### ATTENTION: Aucune autre variable ne vas pas marcher!

```javascript
import {useTranslation} from "react-i18next";

const HomePage = () => {
    const {t} = useTranslation();
    return (
        // Votre code ici
    );
}
```
# Si vous voulez utiliser Variable au milieu de Traduction:
- Dans le fichier de traduction, ajoutez la variable {{count}} comme suit:
### ATTENTION: Aucune autre variable ne vas pas marcher!
- Le suffixe ```_one``` est obligatoire pour les variables de type singulier
- Le suffixe ```_other``` est obligatoire pour les variables de type pluriel

```json
{
    "career_start_one": "Vouz avez {{count}} notification!",
    "career_start_other": "Vouz avez {{count}} notifications!"
}
```
- Ensuite, dans votre composant, utilisez la variable comme suit:
- ATTENTION: Vous ```NE DEVEZ PAS``` utiliser suffixes au moment de l'appel de la variable dans le composant. React-i18next va le comprendre automatiquement.
- Si count = 1, le suffixe ```_one``` sera utilisé, sinon le suffixe ```_other``` sera utilisé automatiquement.

```javascript
import {useTranslation} from "react-i18next";

const HomePage = () => {
    const {t} = useTranslation();
    return (
        <h1>  {t("notification", { count: 1 })} </h1>
    );
}
```
### ATTENTION: Le syntaxe est change comparativement à l'utilisation de variable ```count```
### ATTENTION: Il ```NE FAUT PAS``` declarer la variable ```count``` dans le composant

```javascript
// Sans count
<h1>  {t("notification")} </h1>
// Avec count
<h1>  {t("notification", { count: 1 })} </h1>
```

# Si vous voulez traduire les trucs avec CSS au milieu de votre texte:
Importez le Trans component et utilisez-le comme suit:

```javascript
import { Trans, useTranslation} from "react-i18next";

const HomePage = () => {
    const {t} = useTranslation();
    return (
        <Trans i18nKey="welcomeMessage">
            Votre carrière <br/> commence <span style={{"backgroundColor": "#ff006c", "padding":"0 12px"}}>ici.</span>
        </Trans>
    );
}
```