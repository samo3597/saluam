(function () {
    const birthDateInput = document.getElementById('birthDate');
    const hasParentInfoCheckbox = document.getElementById('hasParentInfo');
    const parentInfoSection = document.getElementById('parentInfo');
    const classInput = document.getElementById('class');
    const parentFirstName = document.getElementById('parentFirstName');
    const parentLastName = document.getElementById('parentLastName');
    const parentPhoneNumber = document.getElementById('parentPhoneNumber');
    const submitBtn = document.querySelector('button[type="submit"]');

    hasParentInfoCheckbox.addEventListener('change', function () {
        parentInfoSection.style.display = this.checked ? 'block' : 'none';
        parentLastName.required = this.checked;
        parentFirstName.required = this.checked;
        parentPhoneNumber.required = this.checked;
    });

    birthDateInput.addEventListener('change', function () {
        const birthDate = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            hasParentInfoCheckbox.checked = true;
            hasParentInfoCheckbox.disabled = true;
            parentInfoSection.style.display = 'block';
            classInput.required = true;
            parentLastName.required = true;
            parentFirstName.required = true;
            parentPhoneNumber.required = true;
            classInput.placeholder = "";
        } else {
            hasParentInfoCheckbox.checked = false;
            hasParentInfoCheckbox.disabled = false;
            parentInfoSection.style.display = 'none';
            classInput.required = false;
            parentLastName.required = false;
            parentFirstName.required = false;
            parentPhoneNumber.required = false;
            classInput.placeholder = "(ոչ պարտադիր)";
        }
    });

    function isValidArmenianPhone(phone) {
        return /^\+374\d{8}$/.test(phone);
    }

    document.getElementById('registrationForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const phoneValue = document.getElementById('phoneNumber').value;
        if (!isValidArmenianPhone(phoneValue)) {
            alert('Հեռախոսահամարը պետք է լինի +374XXXXXXXX ձևաչափով (օր.՝ +37477123456)');
            return;
        }

        if (hasParentInfoCheckbox.checked) {
            const parentPhone = document.getElementById('parentPhoneNumber').value;
            if (!isValidArmenianPhone(parentPhone)) {
                alert('Ծնողի հեռախոսահամարը պետք է լինի +374XXXXXXXX ձևաչափով');
                return;
            }
        }

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            birthDate: document.getElementById('birthDate').value,
            phoneNumber: phoneValue,
            email: document.getElementById('email').value,
            class: document.getElementById('class').value,
            OtherNotes: document.getElementById('OtherNotes').value,
            courseType: document.getElementById('courseType').value,
            parentInfo: {}
        };

        if (hasParentInfoCheckbox.checked) {
            formData.parentInfo = {
                parentFirstName: document.getElementById('parentFirstName').value,
                parentLastName: document.getElementById('parentLastName').value,
                parentPhoneNumber: document.getElementById('parentPhoneNumber').value
            };
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Ուղարկվում է...';

        fetch('https://salu.am/APIReg/hs/register/Reg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(() => {
                showModal();
            })
            .catch(error => {
                console.error(error);
                alert('Տեղի ունեցավ սխալ գրանցման ժամանակ։ Խնդրում ենք կրկին փորձել։');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Հերթագրվել';
            });
    });

    const modal = document.getElementById('successModal');
    const span = document.getElementsByClassName('close')[0];

    function showModal() {
        modal.style.display = 'block';
        document.getElementById('registrationForm').reset();
        document.getElementById('parentInfo').style.display = 'none';
        document.getElementById('courseDetails').style.display = 'none';
    }

    span.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
})();

fetch('courses.json')
    .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    })
    .then(courseDescriptions => {
        document.getElementById('courseType').addEventListener('change', function () {
            const selected = this.value;
            const detailsBlock = document.getElementById('courseDetails');

            if (courseDescriptions[selected]) {
                const course = courseDescriptions[selected];

                const h4 = document.createElement('h4');
                h4.textContent = course.title;

                const priceDiv = document.createElement('div');
                priceDiv.className = 'price';
                priceDiv.textContent = course.price;

                detailsBlock.innerHTML = '';
                detailsBlock.appendChild(h4);
                detailsBlock.appendChild(priceDiv);

                course.description.forEach(text => {
                    const p = document.createElement('p');
                    p.textContent = text;
                    detailsBlock.appendChild(p);
                });

                detailsBlock.style.display = 'block';
            } else {
                detailsBlock.style.display = 'none';
            }
        });
    })
    .catch(error => {
        console.error('Դասընթացների տվյալները չհաջողվեց բեռնել։', error);
    });
