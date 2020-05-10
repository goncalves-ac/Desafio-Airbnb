const params = location.search.slice(1).split('&').reduce((acc, s) => {
    const [k, v] = s.split('=')
    return Object.assign(acc, {[k]: v})
}, {})

function diffData (dataInicial, dataFinal) {

    const dataSplitInicial = dataInicial.split('/');
    const dataSplitFinal = dataFinal.split('/');

    const dayInicial = dataSplitInicial[0];
    const monthInicial = dataSplitInicial[1];
    const yearInicial = dataSplitInicial[2];

    const dayFinal = dataSplitFinal[0];
    const monthFinal = dataSplitFinal[1];
    const yearFinal = dataSplitFinal[2];

    data1 = new Date(yearInicial, monthInicial-1, dayInicial);
    data2 = new Date(yearFinal, monthFinal-1, dayFinal);

    const diff = Math.abs(data1.getTime() - data2.getTime());

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days;
}

function numRandon(min, max) {
    return Math.random() * (max - min) + min;
}

const options = {
    url: 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72',
    type: 'GET',
    dataType: 'json'
};

$(document).ready(function() {

    $.ajax({
        url      : options['url'],
        type     : options['type'],
        dataType : options['dataType'],
    })


    .done(function(json) {

        let el = document.querySelector('.dadosLocal');

        i = 0;

        for (data in json) {
            
            if (json[data]['property_type'] == decodeURIComponent(params.selecao)) {
                
                var divPai = document.createElement('div');
                divPai.className = "classDivPai";
                var divTexto = document.createElement('div');
                divTexto.className = "classDivTexto";
                var divTudo = document.createElement('div');
                divTudo.className = "classDivTudo";
                //var divMap = document.createElement('div');
                //divMap.setAttribute("id", "idDivMap")

                divTudo.style = "display:flex; justify-content: space-around; text-align: center; align-items: center;"
                divPai.style = "width: 50%; "

                let diaEntrada = `${params.dataIn.substr(0, 10).split('-').reverse().join('/')}`;
                let diaSaida = `${params.dataOut.substr(0, 10).split('-').reverse().join('/')}`;
                let totalDias = diffData(diaEntrada,diaSaida);

                divTexto.innerHTML =`
                    <h2 class="titulo-local">${json[data]['name']}</h2>
                    <h5 class="local-local">${json[data]['property_type']}</h5>
                    <h3 class="preco-local"> R$ ${json[data]['price'].toFixed(2).replace('.',',')} á diária.</h3>
                    <h5 class="porPessoa"> Check-in: ${diaEntrada}</h5>
                    <h5 class="porPessoa"> Checkout: ${diaSaida}</h5>
                    <h5 class="porPessoa"> Total a pagar por ${totalDias} dias: R$ ${(json[data]['price'] * totalDias).toFixed(2).replace('.',',')}</h5>
                    <h5 class="porPessoa"> R$ ${((json[data]['price'] * totalDias)/params.Hospedes).toFixed(2).replace('.',',')} por pessoa.</h5>
                `
                
                let hr = `<hr class="hr2">`

                divPai.innerHTML = `
                    <img src= ${json[data]['photo']}>
                `
               

                if (i%2 == 0) {
                    divTudo.append(divTexto, divPai);
                } else {
                    divTudo.append(divPai, divTexto);
                }


                $('.dadosLocal').append(divTudo, hr);

                i += 1;
            }
            
        }

        mapboxgl.accessToken = 'pk.eyJ1IjoiYWNnb25jYWx2ZXMiLCJhIjoiY2thMDZnbG90MG8wbjNmbzFiaWt0dG8wdSJ9.HrrNI6ITXkjAI37f503h-Q';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-48.58593643, -22.48007645],
            zoom: 7
        });

        var marker = [];
        for (var j = 0; j < i; j++){
            marker += new mapboxgl.Marker()
                .setLngLat([numRandon(-48.09375107, -47.99706817), numRandon(-22.98266875, -21.95934904)])
                .addTo(map);
        }
        
        
    })
    .fail(function(xhr, status, errorThrown) {

        alert('Erro na requisição!');
        console.error(`Error: ${errorThrown}`);
        console.error(`Status: ${status}`);
        console.log(xhr);
    });
});
