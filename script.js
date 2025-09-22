document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '34a667c8596ea88eeda6494cf0bc872d'; // Thay bằng API Key từ https://www.api-football.com/
    const API_URL = 'https://v3.football.api-sports.io/fixtures?date=2025-04-12'; // Lấy trận theo ngày
    const MATCHES = [
        { time: '18:30', home: 'Man City', away: 'Crystal Palace', altHome: 'Manchester City', fixtureId: null },
        { time: '21:00', home: 'Southampton', away: 'Aston Villa', altHome: 'Southampton', fixtureId: null },
        { time: '23:30', home: 'Arsenal', away: 'Brentford', altHome: 'Arsenal', fixtureId: null },
        { time: '23:00', home: 'Inter Milan', away: 'Cagliari', altHome: 'Inter', fixtureId: null }
    ];

    // Hàm lấy dữ liệu từ API
    async function fetchMatches() {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    'x-apisports-key': API_KEY
                }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            updateMatches(data.response);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    }

    // Hàm cập nhật giao diện
    function updateMatches(fixtures) {
        const matches = document.querySelectorAll('.match');
        matches.forEach((matchElement, index) => {
            const matchData = MATCHES[index];
            const fixture = fixtures.find(f => {
                const homeMatch = f.teams.home.name.toLowerCase().includes(matchData.home.toLowerCase()) ||
                                 f.teams.home.name.toLowerCase().includes(matchData.altHome.toLowerCase());
                const awayMatch = f.teams.away.name.toLowerCase().includes(matchData.away.toLowerCase());
                return homeMatch && awayMatch;
            });

            const statusElement = matchElement.querySelector('.match-status');
            const homeScoreElement = matchElement.querySelector('.home-score');
            const awayScoreElement = matchElement.querySelector('.away-score');

            if (fixture) {
                // Lưu fixtureId
                if (!matchData.fixtureId) {
                    matchData.fixtureId = fixture.fixture.id;
                    matchElement.dataset.fixtureId = fixture.fixture.id;
                }

                // Cập nhật tỷ số
                const newHomeScore = fixture.goals.home ?? 0;
                const newAwayScore = fixture.goals.away ?? 0;

                // Kiểm tra bàn thắng mới để thêm hiệu ứng
                if (homeScoreElement.textContent != newHomeScore) {
                    homeScoreElement.classList.add('goal-scored');
                    setTimeout(() => homeScoreElement.classList.remove('goal-scored'), 2000);
                }
                if (awayScoreElement.textContent != newAwayScore) {
                    awayScoreElement.classList.add('goal-scored');
                    setTimeout(() => awayScoreElement.classList.remove('goal-scored'), 2000);
                }

                homeScoreElement.textContent = newHomeScore;
                awayScoreElement.textContent = newAwayScore;

                // Cập nhật trạng thái
                const status = fixture.fixture.status.short;
                if (status === 'NS') {
                    statusElement.textContent = 'Sắp diễn ra';
                    statusElement.style.backgroundColor = '#e63946';
                } else if (['1H', '2H', 'HT'].includes(status)) {
                    statusElement.textContent = `Đang diễn ra (${fixture.fixture.status.elapsed}'}`;
                    statusElement.style.backgroundColor = '#2a9d8f';
                } else if (status === 'FT') {
                    statusElement.textContent = 'Kết thúc';
                    statusElement.style.backgroundColor = '#264653';
                }
            } else {
                homeScoreElement.textContent = '0';
                awayScoreElement.textContent = '0';
                statusElement.textContent = 'Sắp diễn ra';
                statusElement.style.backgroundColor = '#e63946';
            }
        });
    }

    // Gọi API lần đầu
    fetchMatches();

    // Làm mới dữ liệu mỗi 30 giây
    setInterval(fetchMatches, 30000);
});