document.getElementById('emailForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('status');

    const formData = {
        emails: form.elements.emails.value,
        subject: form.elements.subject.value,
        message: form.elements.message.value
    };

    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';
    statusDiv.className = '';
    statusDiv.innerText = '';

    try {
        const response = await fetch('http://localhost:3000/send-emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            statusDiv.className = 'success';
            statusDiv.innerText = result.success;
            form.reset();
        } else {
            throw new Error(result.error || 'Ocorreu um erro desconhecido.');
        }

    } catch (error) {
        statusDiv.className = 'error';
        statusDiv.innerText = `Erro: ${error.message}`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar E-mails';
    }
});