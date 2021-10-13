<template>
  <v-card>
    <v-card-title>
      <span>NTRP</span>
    </v-card-title>
    <v-card-subtitle>
      National Tennis Rating Program
    </v-card-subtitle>
    <v-card-text>
      <div v-for="(info, index) in infos" :key="index" class="mb-2">
        <div class="font-weight-black">{{ info.title }}</div>
        <div>{{ info.content }}</div>
      </div>
      <v-divider class="my-3"></v-divider>
      <div>{{ source }}}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn block color="error" @click="closeHelpNtrp">닫기</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      infos: [
        { title: '1.0', content: '테니스를 처음 배우기 시작한 사람' },
        {
          title: '1.5',
          content: `
            스트로크를 배우는 중이지만, 아직 공을 인-플레이 시키는 것을 연습 중.
            아직 경기를 할 수준이 아님.`,
        },
        {
          title: '2.0',
          content: `
            코트에서 좀 더 경험을 쌓아야 하고 경기를 플레이하는 데에 집중을 해야함.
            아직 정확한 공의 타점을 맞추지 못하고 스트로크에 대한 연습을 더 하거나 레슨이 필요함.
            단식과 복식의 위치선정에 대해 잘 모름.`,
        },
        {
          title: '2.5',
          content: `
            공이 날아오는 위치에 따라 어떻게 리턴을 해야하는지 감을 잡고 있음.
            코트 내에서의 움직임이 비효율적임.
            비슷한 수준의 사람들하고 베이스라인 랠리를 천천히 주고받을 수 있고 조금씩 스트로크를 함.
            단식과 복식의 기본적인 위치선정을 알고 있음.
            다른 사람들과 경기를 할 정도의 수준이 됨.`,
        },
        {
          title: '3.0',
          content: `
            중간 속도의 공으로 베이스라인 랠리를 주고받을 수 있음.
            하지만 모든 샷이 부드러운 건 아니고 깊이나 방향, 속도 조절 시 에러가 생김.
            복식에서 한 명은 전위, 한 명은 후위에 위치함.`,
        },
        {
          title: '3.5',
          content: `
            스트로크로 랠리가 가능하고 방향 조절도 가능함.
            깊이 조절이나 샷의 다양성이 부족. 길이 조절이 잘 안됨.
            로브, 오버헤드(스매시), 어프로치샷, 그리고 발리는 가능은 하나 성공률이 높지 않음.
            네트플레이가 더 편하고, 위치에 대한 이해가 높아짐.
            복식에서 팀플레이를 하기 시작.`,
        },
        {
          title: '4.0',
          content: `
            베이스라인 랠리에서 모든 샷이 안정적임.
            다소 빠른 랠리에서 포핸드와 백핸드 모두 방향과 길이 조절이 가능함.
            로브와 오버헤드(스매시), 어프로치샷과 발리가 효율적임(성공률이 높음).
            서브가 강해 상대의 포스드 에러(forced error)를 유발함.
            기다림이 부족해서 포인트를 잃음.
            복식에서 뚜렷한 전략을 가지고 팀전을 함.`,
        },
        {
          title: '4.5',
          content: `
          공의 속도와 스핀을 자유롭게 조절할 수 있고, 효율적으로 코트위치를 선택함.
          샷의 길이를 컨트롤 할 수 있고 상대와 나의 전력을 분석하여 샷 구사가 가능.
          강하고 정확하게 첫 서브를 넣을 수 있고, 세컨서브도 코스 공략이 가능
          어려운 샷에서 너무 강하게 쳐서 아웃되는 경우가 있음.
          복식에서 공격적으로 네트플레이를 함.`,
        },
        {
          title: '5.0',
          content: `
            모든 샷이 안정적이며 예측하여 기다렸다가 샷을 구사함.
            포인트를 설계하는 단계.
            위닝샷을 구사할 수 있고 상대의 에러를 적절히 사용하여 발리로 포인트를 끝냄.
            로브, 드롭샷, 하프발리, 오버헤드(스매시)를 모두 에러없이 구사할 수 있음.
            세컨서브에서 스핀과 길이조절이 가능.`,
        },
        {
          title: '5.5',
          content: `
            공의 속도와 안정적인 스트로크가 강력한 무기임.
            경기 중 전략의 변화를 줄 수 있고 어려운 상황에서 안정적으로 경기를 운영함.`,
        },
        {
          title: '6.0',
          content: `국가 내 활동하는 프로 선수급. 프로 전문 트레이닝을 이수하는 선수,`,
        },
        { title: '6.5~7.0', content: `세계 수준급 프로 테니스 선수.` },
      ],
      source: `출처 : [네이버 블로그] ]NTRP가 뭐길래..NTRP의 오해와 진실 by.힐리언`,
    }
  },
  methods: {
    closeHelpNtrp() {
      this.$emit('closeHelpNtrp')
    },
  },
}
</script>

<style lang="scss" scoped>
.v-card {
  max-height: 80vh;
  .v-card-text {
    max-height: calc(80vh - 126px);
  }
}
</style>

48-16+42+52
