        document.querySelectorAll('.card-header').forEach(header => {
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                header.nextElementSibling.classList.toggle('active');
            });
        });

        document.querySelectorAll('.genre-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        });

        document.querySelectorAll('.pfp-item').forEach(item => {
            item.addEventListener('click', () => {
                const parentGrid = item.closest('.pfp-grid');
                parentGrid.querySelectorAll('.pfp-item').forEach(i => i.classList.remove('selected'));

                item.classList.add('selected');
            });
        });