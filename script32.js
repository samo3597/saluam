document.addEventListener('DOMContentLoaded', function () {
    const birthDateInput = document.getElementById('birthDate');
    const hasParentInfoCheckbox = document.getElementById('hasParentInfo');
    const parentInfoSection = document.getElementById('parentInfo');
    const classInput = document.getElementById('class');
    const parentFirstName = document.getElementById('parentFirstName');
    const parentLastName = document.getElementById('parentLastName');
    const parentPhoneNumber = document.getElementById('parentPhoneNumber');

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

    document.getElementById('registrationForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            birthDate: document.getElementById('birthDate').value,
            phoneNumber: document.getElementById('phoneNumber').value,
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

        fetch('https://salu.am/APIReg/hs/register/Reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                // Показать модальное окно при успешной регистрации
                showModal();
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при регистрации.');
            });
    });

    // Функции для показа и скрытия модального окна
    const modal = document.getElementById('successModal');
    const span = document.getElementsByClassName('close')[0];

    function showModal() {
        modal.style.display = 'block';
        document.getElementById('firstName').value = "";
        document.getElementById('lastName').value = "";
        document.getElementById('birthDate').value = "";
        document.getElementById('phoneNumber').value = "";
        document.getElementById('email').value = "";
        document.getElementById('OtherNotes').value = "";
        document.getElementById('courseType').value = "";
        document.getElementById('parentFirstName').value = "";
        document.getElementById('parentLastName').value = "";
        document.getElementById('parentPhoneNumber').value = "";
        document.getElementById('hasParentInfo').checked = false;
        document.getElementById('hasParentInfo').disabled = false;
        document.getElementById('parentInfo').style.display = 'none';
        document.getElementById('class').value = "";
        document.getElementById('courseDetails').style.display = "none";
    }

    span.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});


const courseDescriptions = {
    GeneralEnglish: {
        title: "Ընդհանուր անգլերեն (6-9-րդ դասարան)",
        price: "25 000 ֏/ամիս",
        description: "Շաբաթական 2 դաս, 2 ժամ տևողությամբ։"
    },
    PreUniversity2: {
        title: "Նախաբուհական ծրագիր 11-րդ դասարան (2 դաս)",
        price: "30 000 ֏/ամիս֏",
        description: "Նպատակաուղղված խորացված ծրագիր՝ համապատասխան ակադեմիական պահանջներին։</p><p>Շաբաթական 2 դաս, 2 ժամ տևողությամբ։"
    },
    PreUniversity3: {
        title: "Նախաբուհական ծրագիր 11-րդ դասարան (3 դաս)",
        price: "40 000 ֏/ամիս",
        description: "Նպատակաուղղված խորացված ծրագիր՝ համապատասխան ակադեմիական պահանջներին։</p><p>Շաբաթական 3 դաս, 2 ժամ տևողությամբ։"
    },
    Adults: {
        title: "Խոսակցական անգլերեն",
        price: "30 000 ֏/ամիս",
        description: "Գործնական քերականություն, պրակտիկ բառապաշար, լսողական և խոսքային զարգացման ինտենսիվ դասընթաց։</p><p>Շաբաթական 2 դաս, 2 ժամ տևողությամբ։"
    },
    Small: {
        title: "Անգլերեն փոքրահասակ երեխաների համար՝ կենտրոնի հավաստագրված մասնագետի մոտ",
        price: "20 000 ֏/ամիս",
        description: "Լեզվի յուրացման համակողմանի մոտեցում՝ փոքր տարիքային խմբերի համար։</p><p>Շաբաթական 2 դաս, 2 ժամ տևողությամբ։"
    }
};

document.getElementById('courseType').addEventListener('change', function () {
    const selected = this.value;
    const detailsBlock = document.getElementById('courseDetails');

    if (courseDescriptions[selected]) {
        const course = courseDescriptions[selected];
        detailsBlock.innerHTML = `
            <h4>${course.title}</h4>
            <div class="price">${course.price}</div>
            <p>${course.description}</p>
        `;
        detailsBlock.style.display = "block";
    } else {
        detailsBlock.style.display = "none";
    }
});

