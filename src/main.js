document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img').forEach(function(img) {
        img.setAttribute('draggable', false);
    });

    updateTime();
    navigator.getGamepads()[0];
});

function updateTime(){
    var date = new Date();
    var hours = date.getHours();
    var mins = date.getMinutes();
    
    
    mins = (mins < 10) ? '0' + mins : mins;
    
    document.getElementById('time-hours').innerText = hours;
    document.getElementById('time-minutes').innerText = mins;
    const formatter = new Intl.DateTimeFormat('en', { month: 'long' });
    document.getElementById('date').innerText = date.getDate() + ' ' + formatter.format(new Date()) + ' ' + date.getFullYear();
    
    setTimeout(updateTime, 1000);
    
}

document.addEventListener('mousemove', function() {
    document.body.style.cursor = 'unset';
});

document.addEventListener('mousedown', function() {
    document.body.style.cursor = 'unset';

    switch(document.body.getAttribute('state')) {
        case 'settings':
            var substate = 'settings-main';
            if(document.body.getAttribute('substate') != '') substate = document.body.getAttribute('substate');
            document.getElementById('settings-app').querySelector('.' + substate).querySelectorAll('div').forEach(function(option) {
                option.classList.remove('selected');
            });
            break;
    }
});

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function(key) {
    switch(document.body.getAttribute('state')) {
        case 'home':
            document.body.style.cursor = 'none';

            switch(key.code) {
                case 'ArrowRight':
                    var nextOne = false;
                    document.querySelectorAll('.app').forEach(function(app) {
                        if(app.classList.contains('selected')) {
                            nextOne = true;
                        } else {
                            nextOne = false;
                        }
                    });

                    if(nextOne) return;
                    document.querySelectorAll('.app').forEach(function(app) {
                        if(nextOne) {
                            nextOne = false;
                            app.classList.add('selected');
                            document.getElementById('subtext').style.opacity = 0;
                            setTimeout(function() {
                                document.getElementById('subtext').innerHTML = 'Open the ' + app.getAttribute('app') + ' app';
                                document.getElementById('subtext').style.opacity = 1;
                            }, 100);
                            return;
                        }
                        if(app.classList.contains('previous')) {
                            app.classList.add('hidden');
                            return; 
                        }
                        if(app.classList.contains('selected')) {
                            app.classList.replace('selected', 'previous');
                            nextOne = true;
                            return;
                        }
                    });
                    break;
                case 'ArrowLeft':
                    var firstOne = false;
                    var i = 0;
                    var numberOfHiddens = 0;
                    document.querySelectorAll('.app').forEach(function(app) {
                        i++;
                        if(i == 1 && app.classList.contains('selected')) {
                            firstOne = true;
                        }
                        if(app.classList.contains('hidden')) {
                            numberOfHiddens++;
                        }
                    });
                    
                    if(firstOne) return;

                    i = 0;
                    document.querySelectorAll('.app').forEach(function(app) {
                        if(app.classList.contains('hidden')) {
                            i++;
                            if(i == numberOfHiddens) app.classList.remove('hidden');
                            return;
                        }
                        if(app.classList.contains('previous')) {
                            app.classList.replace('previous', 'selected');
                            app.classList.remove('hidden');
                            document.getElementById('subtext').style.opacity = 0;
                            setTimeout(function() {
                                document.getElementById('subtext').innerHTML = 'Open the ' + app.getAttribute('app') + ' app';
                                document.getElementById('subtext').style.opacity = 1;
                            }, 100);
                            return; 
                        }
                        if(app.classList.contains('selected')) {
                            app.classList.remove('selected');
                            return;
                        }
                    });
                    break;
                case 'Enter':
                    var appToStart = null;
                    document.querySelectorAll('.app').forEach(function(app) {
                        if(app.classList.contains('selected')) {
                            document.getElementById('app-animation').style.background = app.getAttribute('color');
                            document.getElementById('app-animation-img').src = app.querySelector('img').src;

                            setTimeout(function() {
                                startApp(app.getAttribute('app').replace(' ', '-').toLowerCase(), app.getAttribute('local'));
                            }, 300);
                        }
                    });
                    document.getElementById('app-animation').style.zIndex = 1;
                    document.getElementById('app-animation').className = 'triggered';
                    setTimeout(function() {
                        document.getElementById('app-animation').style.opacity = 0;
                        setTimeout(function() {
                            document.getElementById('app-animation').className = '';
                            document.getElementById('app-animation').removeAttribute('style');
                            document.getElementById('app-animation').style.zIndex = -1;
                            document.getElementById('app-animation-img').src = '';
                        }, 500);
                    }, 1000);
                    break;
            }

            break;
        case 'settings':
            var substate = 'settings-main';
            if(document.body.getAttribute('substate') != '') substate = document.body.getAttribute('substate');
            switch(key.code) {
                case 'ArrowDown':
                    var selectedExists = false;
                    var nextOneExists = false;
                    document.getElementById('settings-app').querySelector('.' + substate).querySelectorAll('div').forEach(function(option) {
                        if(selectedExists) {
                            selectedExists = null; //done
                            option.classList.add('selected');
                            nextOneExists = true;
                            return;
                        }
                        if(option.classList.contains('selected')) {
                            selectedExists = true;
                            option.classList.remove('selected');
                            return;
                        }
                    });
                    if(selectedExists == false || !nextOneExists) {
                        document.getElementById('settings-app').querySelector('.' + substate).querySelector('div').classList.add('selected');
                    }
                    break;
                case 'ArrowUp':
                    var previousOne = null;
                    document.getElementById('settings-app').querySelector('.' + substate).querySelectorAll('div').forEach(function(option) {
                        if(option.classList.contains('selected')) {
                            if(previousOne !== null) {
                                option.classList.remove('selected');
                                previousOne.classList.add('selected');
                            }
                        }

                        previousOne = option;
                    });
                    break;
                case 'Enter':
                    document.getElementById('settings-app').querySelector('.' + substate).querySelectorAll('div').forEach(function(option) {
                        if(option.classList.contains('selected')) {
                            switch(option.getAttribute('type')) {
                                case 'link':
                                    option.style.backgroundColor = '#f9f9f9';
                                    presentPane(option.getAttribute('linkdest'), substate, true);
                                    setTimeout(function() {
                                        option.style.backgroundColor = 'white';
                                    }, 300);
                                    break;
                            }
                        }
                    });
                    break;
                case 'Backspace':
                    var substate = 'settings-main';
                    if(document.body.getAttribute('substate') != '') substate = document.body.getAttribute('substate');
                    if(document.querySelector('.' + substate).getAttribute('parent') != 'none') {
                        presentPane(document.querySelector('.' + substate).getAttribute('parent'), substate, false);
                    } else return;
                    break;
                case 'Escape':
                    document.getElementById('settings-app').style.transform = 'scale(0.9)';
                    document.getElementById('settings-app').style.opacity = 0;
                    document.body.setAttribute('state', 'home');
                    document.body.setAttribute('substate', '');

                    setTimeout(function() {
                        document.getElementById('settings-app').removeAttribute('style');
                        document.getElementById('settings-app').style.display = 'none';

                        var substate = 'settings-main';
                        if(document.body.getAttribute('substate') != '') substate = document.body.getAttribute('substate');
                        document.querySelector('.' + substate).querySelectorAll('div').forEach(function(item) {
                            item.classList.remove('selected');
                        });
                        document.getElementById('settings-app').querySelectorAll('div').forEach(function(item) {
                            if(item.parentElement != document.getElementById('settings-app')) return;

                            if(item.className == 'settings-main') {
                                item.style.opacity = 1;
                                item.style.zIndex = 1;
                            } else {
                                item.style.opacity = 0;
                                item.style.zIndex = -1;
                            }
                        });
                        document.querySelector('.settings-main').querySelectorAll('div').forEach(function(item) {
                            item.style.left = '50%';
                        });
                    }, 200);
                    break;
            }
            break;
        case 'itunes-remote':
            switch(key.code) {
                case 'Escape':
                    document.getElementById('itunes-remote-app').style.transform = 'scale(0.9)';
                    document.getElementById('itunes-remote-app').style.opacity = 0;
                    document.body.setAttribute('state', 'home');
                    document.body.setAttribute('substate', '');

                    setTimeout(function() {
                        document.getElementById('itunes-remote-app').removeAttribute('style');
                        document.getElementById('itunes-remote-app').style.display = 'none';
                    }, 200);
                    break;
            }
            break;
    }
});

function presentPane(pane, old, forward) {
    document.body.setAttribute('substate', pane);

    if(forward) {
        var a = '70%';
        var b = '30%';
    } else {
        var a = '30%';
        var b = '70%';
    }

    document.querySelector('.' + pane).querySelectorAll('div').forEach(function(item) {
        item.style.transition = 'none';
        item.style.left = a;
    });

    setTimeout(function() {
        document.querySelector('.' + old).style.opacity = 0;
        document.querySelector('.' + old).style.zIndex = -1;
        document.querySelector('.' + pane).style.opacity = 1;
        document.querySelector('.' + pane).style.zIndex = 1;
    
        document.querySelector('.' + old).querySelectorAll('div').forEach(function(item) {
            item.style.left = b;
        });
    
        document.querySelector('.' + pane).querySelectorAll('div').forEach(function(item) {
            item.style.transition = '0.3s cubic-bezier(0.35, 0.03, 0, 1.02) left';
            item.style.left = '50%';
        });

        if(!forward) {
            setTimeout(function() {
                document.querySelector('.' + old).querySelectorAll('div').forEach(function(item) {
                    if(item.classList.contains('selected')) item.classList.remove('selected');
                });
            }, 300);
        }
        
    }, 0);
}

function startApp(app, local) {
    if(local == 'true') {
        document.getElementById(app + '-app').style.display = 'block';
        document.body.setAttribute('state', app);
    }
}