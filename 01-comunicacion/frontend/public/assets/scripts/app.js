const PATH_API_CONFIG = '/api/config';

const callBackend = (response) => {
  fetch(response.backend1 + '/message')
    .then((res) => res.json())
    .then((response) => {
      messageBackend1.textContent = response.messageBackend1;
      messageBackend2.textContent = response.messageBackend2;
    });
};

fetch(PATH_API_CONFIG)
  .then((res) => res.json())
  .then(callBackend);
