        // Function to change episode
        function changeEpisode(epNumber) {
            window.location.href = `/AniPlayer/<%=AniId%>/` + epNumber;
        }
        
        // Add click event to episode cards
        document.querySelectorAll('.episode-card').forEach((card, index) => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.episode-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                changeEpisode(index);
            });
        });
        
        // Share button functionality
        document.querySelector('.share-btn').addEventListener('click', function() {
            document.querySelector('.modal-container').style.display = 'block';
        });
        
        // Close modal
        document.querySelector('.stay').addEventListener('click', () => {
            document.querySelector('.modal-container').style.display = 'none';
        });
        document.querySelector('.leave').addEventListener('click', () => {
            document.querySelector('.modal-container').style.display = 'none';
        });
        
        // Previous and Next buttons
        const prevBtn = document.querySelector('.btn-primary:first-child');
        const nextBtn = document.querySelector('.btn-primary:last-child');
        const currentEp = <%= Number(AniEP) %>;
        const totalEps = <%= video.ep.length + 1 %>;

        if (currentEp > 0) {
            prevBtn.addEventListener('click', () => changeEpisode(currentEp - 1));
        } else {
            prevBtn.disabled = true;
        }

        if (currentEp < totalEps - 1) {
            nextBtn.addEventListener('click', () => changeEpisode(currentEp + 1));
        } else {
            nextBtn.disabled = true;
        }

        // Download button
        const downloadBtn = document.querySelector('.btn-secondary:first-of-type');
        <% if(video.type === "mp4") {%> 
            <% if(Number(AniEP) === 0 ) {%> 
                downloadBtn.addEventListener('click', () => window.location.href = "/<%=video.link%>");
            <% } else { %> 
                <% const Episode = Number(AniEP) - 1 %> 
                downloadBtn.addEventListener('click', () => window.location.href = "/<%=video.ep[Episode].link%>");
            <% } %> 
        <% } else { %>
            <% if(Number(AniEP) === 0 ) {%> 
                downloadBtn.addEventListener('click', () => window.location.href = "<%=video.link%>");
            <% } else {%> 
                <% const Episode = Number(AniEP) - 1 %> 
                downloadBtn.addEventListener('click', () => window.location.href = "<%=video.ep[Episode].link%>");
            <% } %> 
        <% } %>  
    </script>

    <script>
        /**
        *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
        
        var disqus_config = function () {
        this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = window.location.pathname; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        
        (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://anipub.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
        })();
    </script>
    <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>

    <script id="dsq-count-scr" src="//anipub.disqus.com/count.js" async></script>
    <script src="https://vjs.zencdn.net/8.16.1/video.min.js"></script>
    <script src="/videoPlay.js"></script>
    <script src="/Changer-AniPlayer.js"></script> 
    <script src="/dialog.js"></script>
    <script src="/upDate-playlist.js"></script>
    <script src="/home.js"></script>
    <script src="/playList-Up.js"></script>
    <script src="/ANiPlayer-render.js"></script> 
    <script src="/play.js"> </script>
    <script>
        if(window.location.protocol === "http:") {
            const NEWL = document.querySelectorAll(".poster,.episode-thumb,.anime-poster,.anime-thumb") ;
            NEWL.forEach(value=>{ const SRC = value.src; 
                const hiluR = SRC.split("https://"); 
                if(hiluR.length === 2) 
                { const SEC = hiluR[1]; 
                    const ILU = `https://` + SEC; 
                    value.src = ILU ; 
                } });
        } else {
       const NEWLS = document.querySelectorAll(".poster,.episode-thumb,.anime-poster,.anime-thumb") ;
       NEWLS.forEach(value=>{ const SRC = value.src; 
        const hiluR = SRC.split("https://"); 
        if(hiluR.length >= 3 ) { const SEC = hiluR[2];
             const ILU = `https://` + SEC; value.src = ILU ; } });}
