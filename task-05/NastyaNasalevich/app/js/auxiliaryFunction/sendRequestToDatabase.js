/* exported sendRequestToDatabase */

function sendRequestToDatabase(method, path, key, body) {
    var chatURL = 'https://mychat-b0091.firebaseio.com/';
    return fetch(
        chatURL + path + key + '.json',
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify(body)
        }
    )  
    .then(function getResponse(response) {
        return response.json();
    }).catch(function err(error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
    });
}
