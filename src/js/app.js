// console.log("hello world")

//////// variable //////////

const ctx = document.getElementById('myChart');


const btnSend = document.querySelector('[type = submit]');
const btnReset = document.querySelector('.reinitialiser');
const btnNewData = document.querySelector('.new-data');

const inputNAme = document.querySelector('[name = prenom]');
const inputDate = document.querySelector('[name = date]');
const inputKilo = document.querySelector('[name = kilo]');
const inputTaille = document.querySelector('[name = taille]');
const inputNewkilo = document.querySelector('[name = new-poids]');

const divConnetion = document.querySelector('.connexion');
const divInfo = document.querySelector('.info');
const divInfoPerso = document.querySelector('.infoPerso');
const divBmi = document.querySelector('.bmi');


//////// class /////////////

class Data {
    constructor(data) {
        this.data = data
    }

    setData() {
        if (!(inputNAme && inputDate && inputKilo && inputTaille)) return; 

        let nameValut = inputNAme.value.trim();
        let dateValut = new Date(inputDate.value.trim())
        let kiloValue = parseFloat(inputKilo.value.trim());
        let tailleValue = parseFloat(inputTaille.value.trim()) / 100;

        if (!(nameValut && dateValut && kiloValue && tailleValue)) return ;

        const monobj = {
            'name' : nameValut,
            'age' : this.calculAge(dateValut),
            'imc' : this.calculIMC(kiloValue, tailleValue),
            'kilo' : kiloValue
        }

        localStorage.setItem("data", JSON.stringify(monobj))

        let obj = localStorage.getItem("data");

        let json = JSON.parse(obj)
        
        if (!json) return;

        this.data = json;
        if (divConnetion.classList.contains('remove')) {
            alert('les données sont envoyé');
        }
    }

    getNewData(){
        let valueNewkilo = inputNewkilo.value.trim();

        return parseInt(valueNewkilo);

    }

    
    reset(){
        localStorage.clear()
        divBmi.innerHTML = '';
        divInfoPerso.innerHTML = '';
        divInfo.classList.add('remove');        
        divConnetion.classList.remove('remove');
    }

    calculAge(date) {
        if (!date) return;

        let today = new Date();
        let age = today.getFullYear() > date.getFullYear() ? today.getFullYear() - date.getFullYear() : null;

        return parseInt(age);
    }

    calculIMC(kilo, height){
        if (!(kilo && height)) return;

        let imc = kilo / (height * height);
        
        return parseFloat(imc.toFixed(2))
        
    }
}

class Display {
    constructor(data){
        this.data = data
        this.chart = null;
    }

    affichage(){  
        divInfo.classList.add('remove');        
        if (this.data  === undefined) return;

        divInfoPerso.innerHTML = '';
        divBmi.innerHTML ='';
        divConnetion.classList.add('remove');
        divInfo.classList.remove('remove')
        let divH3 = document.createElement('h3');
        let divH1 = document.createElement('h1');
        let divAge = document.createElement('p');
        let divNumberBmi = document.createElement('p');
        let divNewWeight = document.querySelector('.dernier-poids')
        
        divH3.textContent = 'Hello';
        divH1.textContent = this.data.name;
        divAge.textContent = `Vous avez ${this.data.age} ans`;
        divNewWeight.textContent = `${this.data.kilo} kg`

        divNumberBmi.textContent = '';

        this.count(divNumberBmi, this.data.imc.toFixed(0));

        divInfoPerso.append(divH3,divH1, divAge);
        divBmi.append(divNumberBmi)

        this.updateChart([this.data.kilo]);
        
    }

    updateChart(kiloHistory) {
    if (this.chart) {
        this.chart.destroy();
    }

    console.log(kiloHistory);
    

    this.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jour 1', 'Jour 2', 'Jour 3', 'Jour 4', 'Jour 5', 'Jour 6', 'Jour 7'],
            datasets: [{
                label: 'Poids',
                data: kiloHistory,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    }

    count(element,number){
    let num = 0;

    let interval = setInterval(() => {
        if (num <= number) {
            element.textContent = num;
            num++;
        } else {
            clearInterval(interval);
        }
    }, 100);

    }

    setData(obj){
        this.data = obj
        this.affichage();
    }
}

const data = new Data();
const display = new Display();

//////// function //////////

//////// event /////////////

if (btnSend) {
    btnSend.addEventListener('click', (e) =>{
        e.preventDefault();

        data.setData(); 
        display.setData(data.data);
    });
}

if (btnReset) {
    btnReset.addEventListener('click', (e) =>{
        e.preventDefault();
        
        data.reset();
        
    })
}

if (btnNewData) {
    btnNewData.addEventListener('click', (e) => {
        e.preventDefault();
        let newWeight = data.getNewData();
        
        if (!data.data.kilo.newkilo) {
            data.data.kilo = {
                'newkilo': [data.data.kilo]
            };
        }

        ;
        data.data.kilo.newkilo.push(newWeight);
        console.log()
        


        display.updateChart(data.data.kilo.newkilo);
    });
}



document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
        const json = JSON.parse(storedData);
        data.data = json;
        display.setData(json);

}

});
//////// function apply ////

display.affichage();

// localStorage.clear()








