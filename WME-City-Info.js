// ==UserScript==
// @name         WME Cityinfo display
// @namespace
// @version      2019.4.9.01
// @description  Display city info for selected cities, a button for city info for selected objects with an address field
// @author       justin83, voludu2
// @include      https://beta.waze.com/*
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// ==/UserScript==

var $scrP = 'cityInfo';
(function() {
    'use strict';

    function bootstrap(tries = 1) {
        if (W && W.map &&
            W.model &&
            $ && WazeWrap.Ready) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        W.selectionManager.events.register("selectionchanged", null, displayIfCity);
    }

    function cityInfoHTML(City)
    {
        var $cityAttributes = $(`<div id="ciCityInfoContainer" class="map-comment-name-editor">
<div class='preview'><i class="fa fa-copy" id="ciCopyCityInfoButton" title="Copy city info to clipboard" onclick="$('#ciCityInfoText').select();document.execCommand('copy');"></i>
<input id="ciCityInfoText" value="${City.name};${City.id};${City.stateID};${City.englishName};${$('.WazeControlPermalink > .permalink')[0].href}" readonly /></div>
<div>&nbsp;</div>
<div class='preview'>city: <span>${City.name}</span></div>
<div class='preview'>cityID: <span>${City.id}</span></div>
<div class='preview'>stateID: <span>${City.stateID}</span></div>
<div class='preview'>englishName: <span>${City.englishName}</span></div><br/>
<div><a href="https://docs.google.com/forms/d/e/1FAIpQLSeoEtS5lQNwakeTXzHz98FpB_p2ji-U3XWwyv-Er4nbgEuf9A/viewform" target="_blank">Cities form</a></div>
</div>`);
        return $cityAttributes;
    }
    function showCityButton()
    {
        // Cribbed from PIE - if .address-edit exists, then display a city icon for displaying the city information.
        $('#ciCityButton').remove();
        if(WazeWrap.getSelectedFeatures().length > 0){
            var $city = $('<i class="fa fa-building" id="ciCityButton" title="shows city information" aria-hidden="true" style="display:inline; margin:5px;"></i>');
            $('.address-edit-view').parent().parent().find('.control-label').attr("style", "display:inline");
            $('.address-edit').before($city);

            $('#ciCityButton').click(function(){
                $('#ciCityInfoContainer').remove();
                $('.address-edit').before(cityInfoHTML(WazeWrap.getSelectedFeatures()[0].model.getAddress().attributes.city.attributes));
            });
        }
    }
    function displayIfCity()
    {
        if(WazeWrap.hasSelectedFeatures())
        {
            // City selected - show the information
            if(WazeWrap.getSelectedFeatures()[0].model.type == "city")
            {
                $('#edit-panel > div > div > div > div > div.preview').after(cityInfoHTML(WazeWrap.getSelectedFeatures()[0].model.attributes));
            }
            // Something else selected - show a button instead
            else
            {
                showCityButton();

            }
        }
    }

    bootstrap();
})();
