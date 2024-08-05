// Lấy phần tử có id và gán vào biến
const tinnoibatBtn = document.getElementById("tinnoibat");
const newsBtn = document.getElementById("news");
const giaoducbtn = document.getElementById("giaoduc");
const kinhdoanhBtn = document.getElementById("kinhdoanh");
const thethaoBtn = document.getElementById("thethao");
const congngheBtn = document.getElementById("congnghe");
const giaitriBtn = document.getElementById("giaitri");
const dulichbtn = document.getElementById("dulich");
const suckhoebtn = document.getElementById("suckhoe");
const searchBtn = document.getElementById("searchBtn");

// Ô tìm kiếm tin tức
const newsQuery = document.getElementById("newsQuery");

// Loại tin tức (danh mục tin tức)
const newsType = document.getElementById("newsType");

// Khu vực hiển thị chi tiết tin tức
const newsdetails = document.getElementById("newsdetails");

const API_KEY = "nerev7cgutuxq6inlzbnn2s1tvmopvuyzzvjdqr9";
const count = 500;
let currentPage = 1;
const itemsPerPage = 12;

let newsDataArr = [];


// Khai báo mảng chứa các URL RSS feed của mục tin tức
const HEADLINES_NEWS = ["https://vnexpress.net/rss/tin-moi-nhat.rss","https://thanhnien.vn/rss/home.rss"];
const TINNOIBAT = ["https://vnexpress.net/rss/tin-noi-bat.rss"];
const GIAODUC =["https://vtcnews.vn/rss/giao-duc.rss","https://nld.com.vn/rss/giao-duc-khoa-hoc.rss"];
const KINHDOANH = ["https://dantri.com.vn/rss/kinh-doanh.rss","https://toquoc.vn/rss/kinh-te-2.rss"];
const THETHAO = ["https://vnexpress.net/rss/the-thao.rss","https://kenh14.vn/rss/sport.rss"];
const CONGNGHE = ["https://vnexpress.net/rss/khoa-hoc.rss","https://vtcnews.vn/rss/cong-nghe.rss"];
const GIAITRI = ["https://vnexpress.net/rss/giai-tri.rss","https://nld.com.vn/rss/giai-tri.rss"];
const DULICH =["https://vnexpress.net/rss/du-lich.rss"];
const SUCKHOE =["https://vnexpress.net/rss/suc-khoe.rss"];


// Hàm reset trang và hiển thị tin tức cho danh mục mới
const resetPaginationAndDisplay = (rssUrls) => {
    currentPage = 1; // Reset về trang 1
    fetchRSSNews(rssUrls);
};


// Khi nhấn vào News Website thì "Tin mới nhất" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ HEADLINES_NEWS
window.onload = function() {
    newsType.innerHTML="<h4>Tin mới nhất</h4>";
    resetPaginationAndDisplay(HEADLINES_NEWS);
};


// Khi nhấn vào News Website thì "Tin mới nhất" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ HEADLINES_NEWS
newsBtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Tin mới nhất</h4>";
    resetPaginationAndDisplay(HEADLINES_NEWS);
});

// Khi nhấn vào nút Tin Nổi Bật thì "Tin Nổi Bật" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ TINNOIBAT
tinnoibatBtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Tin Nổi Bật</h4>";
    resetPaginationAndDisplay(TINNOIBAT);
});

// Khi nhấn vào nút Giáo Dục thì "Giáo Dục" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ GIAODUC
giaoducbtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Giáo Dục</h4>";
    resetPaginationAndDisplay(GIAODUC);
});

// Khi nhấn vào nút Kinh Doanh thì "Kinh Doanh" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ KINHDOANH
kinhdoanhBtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Kinh Doanh</h4>";
    resetPaginationAndDisplay(KINHDOANH);
});

// Khi nhấn vào nút Thể Thao thì "Thể Thao" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ THETHAO
thethaoBtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Thể Thao</h4>";
    resetPaginationAndDisplay(THETHAO);
});

// Khi nhấn vào nút Công Nghệ thì "Công Nghệ" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ CONGNGHE
congngheBtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Công Nghệ</h4>";
    resetPaginationAndDisplay(CONGNGHE);
});

// Khi nhấn vào nút Giải Trí thì "Giải Trí" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ GIAITRI
giaitriBtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Giải Trí</h4>";
    resetPaginationAndDisplay(GIAITRI);
});

// Khi nhấn vào nút Du Lịch thì "Du Lịch" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ DULICH
dulichbtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Du Lịch</h4>";
    resetPaginationAndDisplay(DULICH);
});

// Khi nhấn vào nút Sức Khỏe thì "Sức Khỏe" sẽ xuất hiện và gọi hàm fetchRSSNews để lấy tin từ SUCKHOE
suckhoebtn.addEventListener("click", function(){
    newsType.innerHTML="<h4>Sức Khỏe</h4>";
    resetPaginationAndDisplay(SUCKHOE);
});

// Khi nút Tìm kiếm được nhấn thì "Tìm kiếm" và tên tử khóa cần tìm kiếm xuất hiện, hàm fetchQueryNews để tìm tin tức theo từ khóa nhập vào
searchBtn.addEventListener("click", function(){
    const query = newsQuery.value.trim(); // Loại bỏ khoảng trắng thừa từ từ khóa tìm kiếm
    if (query.length > 0) {
        // Hiển thị từ khóa tìm kiếm trong khu vực loại tin tức
        newsType.innerHTML = `<h4>Tìm kiếm : ${query}</h4>`;
        fetchQueryNews(query); // Gọi hàm fetchQueryNews với từ khóa tìm kiếm
    } else {
        newsdetails.innerHTML = "<h5>Vui lòng nhập từ khóa tìm kiếm.</h5>";
    }
});


// nhấn nút trang trước
document.getElementById("prevPageBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayNews();
    }
});
// nhấn nút trang sau
document.getElementById("nextPageBtn").addEventListener("click", () => {
    if (currentPage * itemsPerPage < newsDataArr.length) {
        currentPage++;
        displayNews();
    }
});

// Hàm tính toán và hiển thị số trang
const updatePageCount = () => {
    const totalPages = Math.ceil(newsDataArr.length / itemsPerPage);
    const pageCountDisplay = document.getElementById("pageCount");
    pageCountDisplay.innerText = `${totalPages}`;
};

// Lấy tin tức từ các URL RSS và hiển thị
const fetchRSSNews = async (rssUrls) => {
    try {
  

       // Khởi tạo một mảng rỗng để lưu trữ tất cả các tin tức
        let allNewsItems = [];

         // Lặp qua từng URL RSS và lấy dữ liệu
        for (const rssUrl of rssUrls) {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=${API_KEY}&count=${count}`);
            //Kiểm tra nếu trạng thái của phản hồi là thành công (mã trạng thái HTTP trong khoảng 200-299).
            if (response.ok) {
                //chuyển JSon thành đối tượng JavaScript và gắn vào biến muJson
                const myJson = await response.json();
                //Thêm các mục tin tức mới vào mảng 
                allNewsItems = allNewsItems.concat(myJson.items);
            } else {
                //Ghi lại mã trạng thái và văn bản trạng thái của phản hồi nếu nó không thành công.
                console.log(response.status, response.statusText);
            }
        }

        // Gán tất cả các tin tức vào mảng toàn cục và hiển thị
        newsDataArr = allNewsItems;
        displayNews();
    //sửa lí nỗi
    } catch (error) {
        console.log(error);
        newsdetails.innerHTML = "<h5>.</h5>";
    }
};


// Hàm tìm kiếm tin tức dựa trên từ khóa nhập vào và loại bỏ tin tức trùng lặp
const fetchQueryNews = async (query) => {
    try {
        // Lấy tin tức từ tất cả các nguồn RSS
        const rssFeeds = [
            ...HEADLINES_NEWS,
            ...TINNOIBAT,
            ...GIAODUC,
            ...KINHDOANH,
            ...THETHAO,
            ...CONGNGHE,
            ...GIAITRI,
            ...DULICH,
            ...SUCKHOE
        ];

        // Chuyển từ khóa tìm kiếm thành chữ thường để tìm kiếm không phân biệt chữ hoa chữ thường
        const normalizedQuery = query.toLowerCase();

        // Hàm lấy tin tức từ một URL RSS duy nhất
        const fetchFeed = async (rssUrl) => {
            try {
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=${API_KEY}&count=${count}`);
                if (response.ok) {
                    const myJson = await response.json();
                    // Lọc các tin tức dựa trên từ khóa trong tiêu đề hoặc mô tả
                    return myJson.items.filter(item =>
                        item.title.toLowerCase().includes(normalizedQuery) ||
                        item.description.toLowerCase().includes(normalizedQuery)
                    );
                } else {
                    console.log(`Error fetching feed from ${rssUrl}: ${response.status} ${response.statusText}`);
                    return [];
                }
            } catch (error) {
                console.log(`Error in fetchFeed: ${error}`);
                return [];
            }
        };

        // Lấy tin tức từ tất cả các nguồn RSS một cách bất đồng bộ
        const allNewsPromises = rssFeeds.map(fetchFeed);
        // Chờ cho tất cả các Promise hoàn thành và ghép kết quả lại
        const results = await Promise.all(allNewsPromises);
        let allNewsItems = results.flat(); // Ghép mảng các mảng thành một mảng duy nhất

        // Loại bỏ các tin tức trùng lặp dựa trên tiêu đề
        const uniqueNewsItems = [];
        const seenTitles = new Set();
        for (const item of allNewsItems) {
            if (!seenTitles.has(item.title)) {
                seenTitles.add(item.title);
                uniqueNewsItems.push(item);
            }
        }

        newsDataArr = uniqueNewsItems; // Gán các tin tức duy nhất vào mảng toàn cục

        if (newsDataArr.length === 0) {
            newsdetails.innerHTML = "<h5>Không tìm thấy dữ liệu.</h5>";
        } 
        else {
            currentPage = 1; // Reset trang về 1 khi tìm kiếm
            displayNews();
        }
    } catch (error) {
        console.log(error);
        newsdetails.innerHTML = "<h5>Có lỗi xảy ra khi tìm kiếm tin tức.</h5>";
    }
};



const displayNews = () => {
     // Xóa nội dung hiện tại của phần tử với ID 'newsdetails'
    newsdetails.innerHTML = "";

    //chỉ số bắt đầu của các tin tức cần hiển thị trên trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    //chỉ số kết thúc của các tin tức cần hiển thị trên trang hiện tại
    const endIndex = startIndex + itemsPerPage;
    // Lấy các tin tức cần hiển thị trên trang hiện tại
    const currentItems = newsDataArr.slice(startIndex, endIndex);

    // Lặp qua mảng các tin tức trong 'newsDataArr'
    currentItems.forEach(news => {
        // Xử lý và lấy ngày tháng từ tin tức, ưu tiên pubDate(Day, DD Mon YYYY HH:MM:SS +0000) nếu có, ngược lại dùng publishedAt(YYYY-MM-DDTHH:MM:SSZ)
        const date = news.pubDate ? news.pubDate.split(" ")[0] : news.publishedAt.split("T")[0];
        
        //tạo khung chứa tin tức
        const col = document.createElement('div');
        col.className = "col-sm-12 col-md-4 col-lg-3 p-2 card";

        // Tạo một phần tử div cho thẻ card
        const card = document.createElement('div');
        card.className = "p-2";

        //Tạo một phần tử img cho hình ảnh
        const image = document.createElement('img');
        image.setAttribute("height", "matchparent");
        image.setAttribute("width", "100%");
        image.src = news.enclosure ? news.enclosure.link : news.urlToImage;

        // Tạo một phần tử div cho phần nội dung chính của thẻ card
        const cardBody = document.createElement('div');

        // Tạo một thẻ h5 cho tiêu đề tin tức
        const newsHeading = document.createElement('h5');
        newsHeading.className = "card-title";
        newsHeading.innerHTML = news.title;

        //Tạo một thẻ h6 cho ngày tháng
        const dateHeading = document.createElement('h6');
        dateHeading.className = "text-primary";
        dateHeading.innerHTML = date;

        //Tạo một thẻ h6 cho ngày tháng
        const description = document.createElement('p');
        description.className = "text-muted";
        description.innerHTML = news.description;
        const images = description.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
            images[i].classList.add('img-fluid');// Để hình ảnh co giãn tự động
        }
        image.style.display = "block";// Đảm bảo hình ảnh xuất hiện trên một dòng riêng

        // Tạo một thẻ span cho nút đọc thêm
        const link = document.createElement('a');
        link.className = "btn btn-dark";
        link.setAttribute("target", "_blank");// Mở liên kết trong tab mới
        link.href = news.link ? news.link : news.url;//Chọn liên kết từ link hoặc url
        link.innerHTML = "Đọc thêm";

        cardBody.appendChild(newsHeading);
        cardBody.appendChild(dateHeading);
        cardBody.appendChild(description);
        cardBody.appendChild(link);

        //card.appendChild(image);
        card.appendChild(cardBody);

        col.appendChild(card);

        newsdetails.appendChild(col);
    });

    //Cập nhật số trang hiện tại trên giao diện.
    document.getElementById("pageNumber").innerText = `Trang ${currentPage}`;
    //Cập nhật thông tin tổng số trang hiển thị trên giao diện
    updatePageCount();

    //Nếu lúc trang đang ở trang 1 thì nút "Trước" sẽ bị vô hiệu hóa
    document.getElementById("prevPageBtn").disabled = currentPage === 1;

    //Nếu lúc trang đang ở trang cuối cùng thì nút "Sau" sẽ bị vô hiệu hóa
    document.getElementById("nextPageBtn").disabled = currentPage * itemsPerPage >= newsDataArr.length;
};