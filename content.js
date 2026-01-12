$(document).ready(
    function() {
        var ov = new OverlayController( 
            [ 
                new OverlayChapter(
                    [new OverlaySlide({fadeIn:true,fadeInDuration: 1500, element: $('#slide1'),text: 'Krankheitserreger und Fremdstoffe gelangen über die Atemwege, die Verdauungsorgane und über Wunden in unseren Körper. <br /><strong>Riesenfresszellen</strong>, die <strong>Makrophagen</strong>, kommen überall im Körper vor. Sie entdecken die körperfremden Stoffe zuerst. Riesenfresszellen umschließen die eingedrungenen Krankheitserreger wie Bakterien oder Grippeviren, nehmen sie in ihr Zellplasma auf und bauen sie ab. Das ist Teil der <strong>unspezifischen Abwehr</strong>.<br />Sind nur wenige Erreger eingedrungen, können die Fresszellen allein mit diesen fertig werden. Die Infektion kommt dann nicht zum Ausbruch und der Mensch erkrankt nicht. Sind zu viele Erreger vorhanden, reicht die unspezifische Abwehr nicht mehr aus.'})],
                    {title:'Makrophage (1)'}
                ),
                new OverlayChapter(
                    [new OverlaySlide({fadeIn:true,fadeInDuration: 1500, element: $('#slide2'),text: 'Andere Lymphocyten werden aktiviert, wenn die unspezifische Immunabwehr die Erkrankung nicht alleine aufhalten kann. <br />Die Riesenfresszellen präsentierten besondere Strukturen der abgebauten Krankheitserreger (Antigene) und aktivieren jetzt T-Helferzellen. Die <strong>spezifische Abwehr</strong> kommt in Gang.<br />Bei der <strong>Aktivierung der T-Helferzellen</strong> müssen das Antigen des Krankheitserregers und der Rezeptor der T-Helferzelle wie ein <strong>Schlüssel</strong> und ein <strong>Schloss</strong> ganz genau zusammenpassen.'})],
                    {title:'Präsentation'}
                ),
                new OverlayChapter(
                    [new OverlaySlide({fadeIn:true,fadeInDuration: 1500, element: $('#slide3'),text: 'Die aktivierten T-Helferzellen schicken <strong>Botenstoffe</strong> aus und aktivieren damit <strong>T-Killerzellen</strong> einerseits und <strong>B-Lymphocyten</strong> andererseits. Die nun folgenden Schritte der weiteren spezifischen Immunabwehr erfolgen <strong>gleichzeitig</strong>, werden hier aber jeder für sich dargestellt.'})],
                    {title:'Aktivierung'}
                ),
                new OverlayChapter(
                    [new OverlaySlide({fadeIn:true,fadeInDuration: 1500, element: $('#slide4'),text: '<strong>Körperzellen</strong>, die von Krankheitserregern infiziert wurden, präsentieren ebenfalls Antigene des Erregers auf ihrer Zelloberfläche. T-Killerzellen können so infizierte Körperzellen <strong>erkennen</strong> und zerstören. '})],
                    {title:'T-Killerzelle'}
                ),
                new OverlayChapter(
                    [new OverlaySlide({fadeIn:true,fadeInDuration: 1500, element: $('#slide5'),text: 'B-Lymphocyten vermehren sich stark und bilden <strong>B-Plasmazellen</strong>, die wiederum Millionen von <strong>spezifischen Antikörpern</strong> produzieren. Antikörper sind spezifische Abwehrstoffe gegen genau diesen einen Erreger. Antikörper werden mit dem Blut in alle Bereiche des Körpers transportiert. Treffen sie dabei auf Erreger, heften sie sich nach dem <strong>Schlüssel-Schloss-Prinzip</strong> an deren Oberflächen. <br />Auf diese Weise verbinden bzw. verklumpen sich immer mehrere von ihnen zu einem <strong>Antigen-Antikörper-Komplex</strong>.'})],
                    {title:'Plasmazelle'}
	            ),
                new OverlayChapter(
                    [new OverlaySlide({fadeIn:true,fadeInDuration: 1500, element: $('#slide6'),text: 'Antigen-Antikörper-Komplexe können von <strong>Makrophagen</strong> als Fremdkörper erkannt werden und werden anschließend von ihnen aufgenommen und verdaut.'})],
                    {title:'Makrophage (2)'}
	            ),
                new OverlayChapter(
                    [new OverlaySlide({fadeIn:true,fadeInDuration: 1500, element: $('#slide7'),text: 'B-Lymphocyten bilden parallel zu Plasmazellen auch <strong>Gedächtniszellen</strong>. Befallen Krankheitserreger desselben Typs ein zweites Mal den Körper, können die Gedächtniszellen sofort die passenden Antikörper herstellen. Die Erreger werden dann schnell unschädlich gemacht. Der Körper ist gegen die Erreger <strong>immun</strong> geworden.'})],
                    {title:'Gedächtniszelle'}					
                 )
                
            ],
            {
                tabContainer: $('#tab-container'),  // html element where the tabs go
                textContainer: $('#text .textColumn'), // where the texts go
                buttonJumpToFirstSlide: $('#beginning'),
                buttonJumpToLastSlide: $('#end'),
                buttonButtonNextSlide: $('#next'),
                buttonPrevSlide: $('#prev'),
                buttonToggleAnnotation: $('#textinfo'),
                slidenumber: $('#slidenumber'),
                activeTabClass:'chapter-active',
                tabClass:'ov-chapter special-border'
            });

        
    });
