/*global define*/
define(function () {

    'use strict';

    return {

        confirm_remove : "Voulez-vou supprimer la ressource?",
        submit_button : "Envoyer",
        reset_button : "Réinitialiser",
        add_button : "Ajouter",
        remove_button : "Supprimer",
        cancel_button : "Annuler",
        back_current_resource : "Ressources",
        no_number_datatype : "Impossible agréger par [{{ dimensions }}] parce que le type de données n’est pas un nombre",
        value_in_group_by : "La dimension 'Valeur' ne peut pas être dans le groupe par",
        missing_group_by : "Spécifier au moins un 'groupe par'",
        missing_value_in_aggregation_rules : "'Valeur' doit être dan Somme, Moyenne, Premier ou Dernier",
        group_by_contains_no_key : "'Groupe par' peut contenir seulement des dimensions",
        exclude_key_dimension : "Les dimensions [{{ dimensions }}] ne peuvent pas être exclues parce qu’elles sont clés.",
        aggregations_dimensions : "Dimensions",
        aggregations_group : "Grouper par",
        aggregations_sum : "Somme",
        aggregations_avg : "Moyenne",
        aggregations_first : "Premier",
        aggregations_last : "Dernier",
        map_select_overlay : "Sélectionner la Surcouche",
        //back steps
        step_metadata : "Métadonnées",
        step_filter: "Filtrer",
        step_aggregations : "Agrégations",
        step_map : "Collection de Couche Earthstat",
        series : "Série",
        xAxis : "Axe X",
        yAxis : "Axe Y",
        tooltip_right_menu : "Paramètres",
        tooltip_remove_button : "Fermer la ressource",
        tooltip_resize_button : "Redimensionner la ressource",
        tooltip_clone_button : "Dupliquer la ressource",
        tooltip_flip_button : "Filtrer la ressource",
        tooltip_metadata_button : "Visualiser les métadonnées",
        tooltip_minimize_button : "Minimiser la ressource",
        tooltip_download_button : "Télécharger la ressource",
        tooltip_toolbar_button : "Options de Visualisation ",
        //Error content
        error_content_title : "Une erreur est survenue",
        error_content_text : "Vous pouvez supprimer l’AVB en utilisant le bouton ci-dessous",
        empty_content_title : "Le résultat est vide",
        empty_content_text : "Vous pouvez supprimer l’AVB ou refaire le filtrage en utilisant le bouton ci-dessous",
        huge_content_title : "Le résultat est trop vaste pour être visualisé",
        huge_content_text : "Vous pouvez refaire le filtrage en utilisant le bouton ci-dessous"

    }
});