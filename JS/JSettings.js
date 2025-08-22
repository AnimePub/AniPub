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

        const bioTextarea = document.getElementById('bio');
        const charCount = document.querySelector('.char-count');
        
        function updateCharCount() {
            const count = bioTextarea.value.length;
            charCount.textContent = `${count}/200`;
            
            charCount.classList.remove('warning', 'danger');
            if (count > 180) {
                charCount.classList.add('warning');
            }
            if (count > 200) {
                charCount.classList.add('danger');
            }
        }
        
        bioTextarea.addEventListener('input', updateCharCount);
        updateCharCount(); 

        document.querySelectorAll('.btn-primary').forEach(button => {
            if (button.textContent.includes('Save')) {
                button.addEventListener('click', () => {
                    const toast = document.getElementById('save-toast');
                    toast.classList.add('show');
                    
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                });
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.settings-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.style.opacity = '0';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            });
        });